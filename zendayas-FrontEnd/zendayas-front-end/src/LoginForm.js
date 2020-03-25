import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }



        this.handlePassword = this.handlePassword.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.loginUser = this.loginUser.bind(this);

    }
    handleUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    handlePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    loginUser() {
        fetch('http://localhost:8080/authenticate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
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
                cookies.set(this.state.username, responseJson.jwt, { path: '/' }); //Storing the jwt for future requests
                //TODO: Redirect to homepage
            })
            .catch((error) => {
                console.log(error)
            });

    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        Log-in to your account
            </Header>
                    <Form size='large' onSubmit={this.loginUser}>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address / Username' onChange={this.handleUsername} />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                onChange={this.handlePassword}
                            />

                            <Button color='blue' fluid size='large'>
                                Login
                </Button>
                        </Segment>
                    </Form>
                    <br />
                    <Form>
                        <Button positive>New user? Register Instead</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}