import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class ProductRouter extends Component {

    /**
     * Adding Product to Database
     */
    addProduct() {
        fetch(BACKEND_BASE_URL + '/addProduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                price: this.state.price,
                description: this.state.description
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to Add Product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Adds a Review for a product, if a review is already present it will be updated
     */
    addReview() {
        fetch(BACKEND_BASE_URL + '/addReview', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                username: this.state.username,
                rating: this.state.rating,
                description: this.state.description
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to Add Review');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Update existing Product in Database
     */
    updateProduct() {
        fetch(BACKEND_BASE_URL + '/updateProduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                price: this.state.price,
                description: this.state.description
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to update product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Set a discount for a product
     */
    setProductDiscount() {
        fetch(BACKEND_BASE_URL + '/setProductDiscount', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                discount: this.state.discountPercentage
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to set discount');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * find all product that contains given string in name
    */
    searchProductsByName() {
        fetch(BACKEND_BASE_URL + '/searchProductsByName', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get products');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * find all products that have a discount
    */
    searchProductWithDiscount() {
        fetch(BACKEND_BASE_URL + '/searchProductWithDiscount', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get products');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * find all products that gave a rating greater than or equal to a value
    */
    findProductsWithRatingGreaterThanAndEqual() {
        fetch(BACKEND_BASE_URL + '/findProductsWithRatingGreaterThanAndEqual', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                rating: this.state.rating
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get products');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * Get a perticular products original price, discount and final price
    */
    getProductPricingDetails() {
        fetch(BACKEND_BASE_URL + '/getProductPricingDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get products');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * Removes Product from Database
    */
    removeProduct() {
        fetch(BACKEND_BASE_URL + '/removeProduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to find product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }












}