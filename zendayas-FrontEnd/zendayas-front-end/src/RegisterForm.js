import React, {Component} from 'react'
import { Button, Form, Grid, Header, Checkbox, Message, Segment } from 'semantic-ui-react'

export default class RegisterForm extends Component {

    render() 
    {
        return(
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='blue' textAlign='center'>
                Register
            </Header>
            <Form size='large'>
                <Segment stacked>
                <Form.Input fluid icon='envelope' iconPosition='left' placeholder='E-mail address' />
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' />
                <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                />
                <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Confirm Password'
                    type='password'
                />
                <Checkbox label='I agree to the Terms and Conditions' />
                    <br/><br/>
                <Button color='blue' fluid size='large'>
                    Register
                </Button>
                </Segment>
            </Form>
            <br/>
            <Form>
            <Button positive>Existing user? Login Instead</Button>
            </Form>
            </Grid.Column>
        </Grid>   
  );
}
}