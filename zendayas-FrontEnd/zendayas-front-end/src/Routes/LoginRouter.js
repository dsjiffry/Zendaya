import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default class LoginRouter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'admin',
            password: 'admin',
            email:'admin@gmail.com'
        }
    }

    render() {  //Used to get jwt and store in cookie
        return (
            <div>
                {console.log(this.loginUser())}
            </div>
        );
    }

    /**
     * Checking the login and stroring the jwt in a cookie if valid.
     */
    loginUser() {
        fetch(BACKEND_BASE_URL + '/authenticate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: this.state.username,
                password: this.state.password
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Incorrect Username or Password');
                }
            })
            .then((responseJson) => {
                cookies.set("jwt", responseJson.jwt, { path: '/' }); //Storing the jwt for future requests
                //TODO: Redirect to homepage
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
     * Creating a normal user
     */
    createUser() {
        fetch(BACKEND_BASE_URL + '/createUser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Username is taken');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * Creating an admin
    */
    createAdmin() {
        fetch(BACKEND_BASE_URL + '/createAdmin', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Username is taken');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * Creating a Store Manager
    */
    createStoreManager() {
        fetch(BACKEND_BASE_URL + '/createStoreManager', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminUsername: this.state.adminUsername,
                adminPassword: this.state.adminPassword,
                StoreManagerUsername: this.state.username,
                StoreManagerPassword: this.state.password,
                StoreManagerEmail: this.state.StoreManagerEmail
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Successful');
                } else {
                    alert('Username is taken');
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    /**
    * Changes password in Database
    */
   changePassword() {
    fetch(BACKEND_BASE_URL + '/changePassword', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+cookies.get('jwt')
        },
        body: JSON.stringify({
            username: this.state.username,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        }),
    })
        .then((response) => {
            if (response.ok) {
                alert('Successful');
            } else {
                alert('Incorrect old Password');
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

}