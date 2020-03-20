import React, {Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

export default class LoginForm extends Component {

render() 
{
    return(
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
            Log-in to your account
        </Header>
        <Form size='large'>
            <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address / Username' />
            <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
            />

            <Button color='blue' fluid size='large'>
                Login
            </Button>
            </Segment>
        </Form>
        <br/>
        <Form>
        <Button positive>New user? Register Instead</Button>
        </Form>
        </Grid.Column>
    </Grid>
    );
}
}