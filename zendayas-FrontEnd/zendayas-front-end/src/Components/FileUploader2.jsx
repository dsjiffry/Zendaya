import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import Cookies from 'universal-cookie';

const BACKEND_BASE_URL = "http://localhost:8080";



export default function FileUploader2() {

    let jwt_token = ""

    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");



    if (user_info_cookie !== null && user_info_cookie !== {} && user_info_cookie !== undefined) {
        jwt_token = user_info_cookie.jwt_token;
    }


    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0])
        upload_image(acceptedFiles[0], "test1")
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


    const upload_image = async (AP_thumbnail, AP_productName) => {
        let formData = new FormData();

        console.log(AP_productName, AP_thumbnail)

        formData.append('file', AP_thumbnail);
        formData.append('productName', AP_productName);

        console.log(formData.get("file"), "Form Data")

        let response2 = await fetch(BACKEND_BASE_URL + '/addThumbnail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer ' + jwt_token
            },
            body: formData,
        })

        console.log(formData, "Form Data", response2)

    }

   


    return (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      )
    }
