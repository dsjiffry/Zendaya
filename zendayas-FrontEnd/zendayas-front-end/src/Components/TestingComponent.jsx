import React from 'react'

import user_helper_function  from "../Contexts/Helper_Functions/user_management"
import FileUploader from './FileUploader'
import FileUploader2 from './FileUploader2'

export default function TestingComponent() {

   
    const testFunction =  async () => {

        const result_AUTH_helper =  await user_helper_function(
            {
                type:"AUTHENTICATE" , 
                payload : {
                    AUTH_username : "admin",
                    AUTH_password : "admin"
                }
            })
            
        console.log(result_AUTH_helper)

    }

    return (
        <div>
            This is a testing Component
            <button onClick = { testFunction }>Click Me</button>
            <FileUploader2/>
        </div>
    )
}
