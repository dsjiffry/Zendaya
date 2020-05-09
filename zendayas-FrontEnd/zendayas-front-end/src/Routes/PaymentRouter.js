import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const jwt = cookies.get('jwt');

export default class PaymentRouter extends Component {

    /**
    * Obtain a users Payment History
    */
    getPaymentHistory() {
        fetch(BACKEND_BASE_URL + '/getPaymentHistory', {
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
                    alert('Unable to get payment history');
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
    * Obtain a particular payment histories details
    */
    getPaymentDetails() {
        fetch(BACKEND_BASE_URL + '/getPaymentDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                username: this.state.username,
                dateTime: this.state.dateTime
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get payment history');
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
     * Set the order status as either "payment invalid", "delivered" or "in transit"
     */
    setOrderStatus() {
        fetch(BACKEND_BASE_URL + '/setOrderStatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                username: this.state.username,
                dateTime: this.state.dateTime,
                status: this.state.status
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Unable to set order status');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * get the current Order Status
    */
   getOrderStatus() {
        fetch(BACKEND_BASE_URL + '/getOrderStatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({
                username: this.state.username,
                dateTime: this.state.dateTime
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Unable to get order Status');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }












}