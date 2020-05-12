import React from 'react'

import { Container, Divider , Header , Grid , GridRow , GridColumn , Input , Segment as Section , Button , Image} from 'semantic-ui-react'

import {UserContext} from "../Contexts/UserStore"
import user_helper_function from "../Contexts/Helper_Functions/user_management"

import {Redirect} from 'react-router-dom'

export default function AdminLogin() {

    const {state,dispatch} = React.useContext(UserContext);

    let initial_state = {
        username : "",
        password : "",
        success : false,
        submitted : false,
        fail : false
    }

    const [data , setData] = React.useState(initial_state)

    React.useEffect(
        () => {console.log(state,dispatch, "submit form() Admin Login use Effect")}, [state]
    )

    const submitForm = () => {
        console.log(data , "submit form() Admin Login")
        let result_AUTH_helper = user_helper_function(
            {
                type:"AUTHENTICATE" , 
                payload : {
                    AUTH_username : data.username,
                    AUTH_password : data.password
                }
            });
        console.log(result_AUTH_helper , "submit form() Admin Login" )
        if(result_AUTH_helper.status === 200)
        {
            

            let result_GET_USER_INFO = user_helper_function({type:"GET_USER_INFO", payload : {GUI_username : data.username}})

            if(result_GET_USER_INFO.status === 200)
            {
                console.log(result_GET_USER_INFO, "submit form() Admin Login");
                dispatch({
                    type : "LOGIN",
                        payload : {
                            username : result_GET_USER_INFO.payload.username,
                            password : result_GET_USER_INFO.payload.password,
                            type : result_GET_USER_INFO.payload.type,
                            jwt : result_AUTH_helper.payload.jwt_token
                        }
                })
                
                setData({...data , success : true})
            }

        } 
        else
        {
            setData({...data , success : false , fail : true})   
        }
    }

    return (
        <Container>
            <br/>
            <br/>
            <Section>
                <Grid>
                    <GridRow></GridRow>
                    <GridRow>
                        <GridColumn width="16" >
                            <Header as = "h1" textAlign = "left">Admin Login</Header>
                            <br/>
                            <br/>
                            <GridRow>
                                <Header as = "h2" textAlign = "left">Username</Header>
                                <Input fluid icon='user' error = {data.fail} placeholder='Username' onChange = { (e) => {setData({...data , username : e.target.value})}} />
                            </GridRow>
                            <br/>
                            <GridRow>
                                <Header as = "h2" textAlign = "left">Password</Header>
                                <Input fluid error = {data.fail} placeholder='Password' type = "password" onChange = { (e) => {setData({...data , password : e.target.value})}}/>
                            </GridRow>
                            <br/>
                            <br/>
                            <Button 
                                primary fluid
                                onClick = {submitForm}
                            >
                                Login
                            </Button>
                        </GridColumn>
                            <br/>
                            <hr/>
                            <br/>
                            <br/>
                    </GridRow>
                </Grid>
            </Section>
            {data.success ? <Redirect to = "adminConsole"/> : null}
        </Container>
    )
}
