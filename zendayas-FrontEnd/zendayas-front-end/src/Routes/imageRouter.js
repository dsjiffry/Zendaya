import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class ImageRouter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: 'Shirt',
            url: '',
        }
    }

    componentDidMount() {
        this.getThumbnail();
    }

    handleClick(event) {
        console.log(event.target.files[0]);
        // this.setState({
        //     selectedFile: event.target.files[0]
        // }, () => this.fileUploadHandler());
    }

    render() {
        return (
            <div>
                <img alt="" src={this.state.url} />
                <br />
                <input
                    id="myInput"
                    type={"file"}
                    onChange={this.handleClick}
                />
            </div>
        );
    }


    /** IMAGES SHOULD NOT EXCEED 1MB */

    /**
     * adds an image to a Product
     */
    addImage(event) {

        let formData = new FormData();
        formData.append('image', event.target.myimage.files[0]);
        formData.append('productName', this.state.productName);

        fetch(BACKEND_BASE_URL + '/addImage', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to Add Image');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * obtain all images for Product
    */
    getImages() {
        fetch(BACKEND_BASE_URL + '/getImages', {
            method: 'POST',
            headers: {
                Accept: 'multipart/form-data',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    alert('Unable to get Images');
                }
            })
            .then((responseBody) => {
                alert(URL.createObjectURL(responseBody));
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Remove an image from a product
     */
    removeImage() {
        fetch(BACKEND_BASE_URL + '/removeImage', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                imageNumber: this.state.imageNumber
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to remove image');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }


    /**
     * adds a thumbnail to a Product
    */
    addThumbnail(event) {
        let formData = new FormData();
        formData.append('image', event.target.myimage.files[0]);
        formData.append('productName', this.state.productName);

        fetch(BACKEND_BASE_URL + '/addThumbnail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to Add Thumbnail');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * obtain the Thumbnail for Product
    */
    getThumbnail() {
        fetch(BACKEND_BASE_URL + '/getThumbnail', {
            method: 'POST',
            headers: {
                Accept: 'image/jpeg',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    alert('Unable to get Thumbnail');
                }
            })
            .then((responseBody) => {
                this.setState({
                    url: URL.createObjectURL(responseBody)
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }






















}