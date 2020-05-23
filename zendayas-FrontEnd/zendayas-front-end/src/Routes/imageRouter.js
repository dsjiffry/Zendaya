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

    render() {
        return (
            <div>
                {this.test()}
            </div>
        );
    }

    test() {
        var json = { "Shirt": { "reviews": {}, "price": { "discountPercentage": 8.0, "originalPrice": 150.0, "finalPrice": 138.0 }, "name": "Shirt", "description": "Cotton Shirt", "average_rating": 0.0 }, "Slippers": { "reviews": { "admin": { "time_stamp": "Mon May 11 02:29:12 UTC 2020", "review": "awesome slippers", "rating": "null", "username": "admin" }, "sm222": { "time_stamp": "Mon May 11 02:29:29 UTC 2020", "review": "bad slippers", "rating": "null", "username": "sm222" } }, "price": { "discountPercentage": 2.0, "originalPrice": 100.0, "finalPrice": 98.0 }, "name": "Slippers", "description": "rubber slippers", "average_rating": 3.0 }, "Shoes": { "reviews": {}, "price": { "discountPercentage": 0.0, "originalPrice": 999.0, "finalPrice": 999.0 }, "name": "Shoes", "description": "nice Shoes", "average_rating": 0.0 } };
        let productNames = [];
        Object.keys(json).forEach(function (key) {
            productNames.push(key);
        });

        productNames.forEach(function (product) {
            fetch(BACKEND_BASE_URL + '/getThumbnail', {
                method: 'POST',
                headers: {
                    Accept: 'image/jpeg',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({
                    productName: product
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.blob();
                    } else {

                    }
                })
                .then((responseBody) => {
                    if (responseBody) {
                        json[product] = { ...json[product], thumbnail_url: URL.createObjectURL(responseBody) }
                    }
                })
                .catch((error) => {
                    console.log(error)
                });

        });



        console.log(json);
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