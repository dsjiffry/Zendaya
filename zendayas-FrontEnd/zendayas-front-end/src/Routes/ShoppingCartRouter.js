import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class ShoppingCartRouter extends Component {

    /**
     * Checks for product in database and then adds it to the user's Shopping Cart
     */
    addToShoppingCart() {
        fetch(BACKEND_BASE_URL + '/addToShoppingCart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                username: this.state.username,
                quantity: this.state.quantity
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to Add to cart');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * get the total price and number of items (This will apply discounts to the products, if they have it.)
     */
    getTotalPriceAndNumberOfItems() {
        fetch(BACKEND_BASE_URL + '/getTotalPriceAndNumberOfItems', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                username: this.state.username
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get details');
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
     * get the items, their individual price and quantity
     */
    getProductsAndDetails() {
        fetch(BACKEND_BASE_URL + '/getProductsAndDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                username: this.state.username
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
     * Checks for product in database and then removes it from the user's Shopping Cart
     */
    removeFromShoppingCart() {
        fetch(BACKEND_BASE_URL + '/removeFromShoppingCart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                productName: this.state.productName,
                username: this.state.username
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to remove from cart');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

























}