import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class ProductCategoryRouter extends Component {

    /**
     * Create a new Product Category in Database
     */
    createCategory() {
        fetch(BACKEND_BASE_URL + '/createCategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                categoryName: this.state.categoryName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to create category');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * add a product to a Category
     */
    addToCategory() {
        fetch(BACKEND_BASE_URL + '/addToCategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                categoryName: this.state.categoryName,
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to add product to category');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * get All categories
    */
    getAllCategories() {
        fetch(BACKEND_BASE_URL + '/getAllCategories', {
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
                    alert('Unable to get categories');
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
     * remove a product to a Category
     */
    removeFromCategory() {
        fetch(BACKEND_BASE_URL + '/removeFromCategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                categoryName: this.state.categoryName,
                productName: this.state.productName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to remove product from category');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * delete a Category
     */
    deleteCategory() {
        fetch(BACKEND_BASE_URL + '/deleteCategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                categoryName: this.state.categoryName
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to delete category');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }













}