import { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class WishListRouter extends Component {

    /**
     * Checks for product in database and then adds it to the user's wish list
     */
    addToWishList() {
        fetch(BACKEND_BASE_URL + '/addToWishList', {
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
                    alert('Unable to find Product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Transfers a product from the wish list to the Shopping Cart
     */
    moveToShoppingCart() {
        fetch(BACKEND_BASE_URL + '/moveToShoppingCart', {
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
                    alert('Unable to move Product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Checks for product in database and then removes it from the user's wish list
     */
    removeFromWishList() {
        fetch(BACKEND_BASE_URL + '/removeFromWishList', {
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
                    alert('Unable to move Product');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }



















    }