import React from 'react'

import { Segment as Section, Header, Divider, Input, Button, Message, Container } from "semantic-ui-react"

import { UserContext } from "../Contexts/UserStore"

import user_manager from "../Contexts/Helper_Functions/user_management"

import {Redirect} from "react-router-dom";


export default function UserSignUp() {

    const { state, dispatch } = React.useContext(UserContext)

    React.useEffect(
        () => { console.log(state, dispatch, "submit form() Admin Login use Effect") }, [state]
    )

    const warning = ["Please Fill All the required Fields \n", "Passwords dont match \n", "Username already taken \n", "invalid email \n"]

    const [formData, setFormData] = React.useState({
        "username": "",
        "email": "",
        "password": "",
        "password2": "",
        "warning": "",
        "formComplete": false,
    })

    const handleFormSubmit = async () => {
        
        //console.log(formData, state)

        //Resetting Warnings
        setFormData({ ...state, warning: "" })

        if (formData.password !== formData.password2) {

            setFormData({ ...state, warning:"", formComplete: false })
            setFormData({ ...state, warning: warning[1], formComplete: false })
            return 0;
        }

        if (formData.email === "" || formData.username === "" || formData.password === "" || formData.password === "" ) {
            setFormData({ ...state, warning:"", formComplete: false })
            setFormData({ ...state, warning: warning[0], formComplete: false })
            return 0;
        }
        else
        {
            
            let command_CREATE_USER = {
                type : "CREATE_USER",
                payload : {
                    CU_username : formData.username,
                    CU_password : formData.password,
                    CU_email : formData.email,
                }
            }

            console.log(command_CREATE_USER)

            let result_CREATE_USER = await user_manager(command_CREATE_USER)

            console.log(result_CREATE_USER)

            if(result_CREATE_USER.status === 200)
            {
                setFormData({...formData , formComplete : true})
                alert(`User ${formData.username} Added !`)
            }
            else if (result_CREATE_USER.status === 409)
            {
                alert(`User ${formData.username} Already Exist Or Admin Password is Wrong !`)
                setFormData({ ...state, warning:"", formComplete: false })
                setFormData({ ...state, warning: warning[2], formComplete: false })
                return 0;
            }
            else
            {
                alert("SERVER ERROR")
            }
            
        }

    }

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    React.useEffect(() => {
        
        return () => {
            
        }
    }, [formData,state])

    return (
        <Container>
            <Section>
                <Header as="h1" textAlign="left">Sign Up</Header>
 
                {(formData.warning !== "") ? <Message>
                    <Message.Header></Message.Header>
                    <p>
                        {formData.warning}
                    </p>
                </Message> : <></> }
                
                
                <Header as="h3" textAlign="left">Username</Header>
                <Input icon='user' iconPosition='left' placeholder='name' fluid name="username" onChange={(e) => { handleFormChange(e) }} />
              
                <Header as="h3" textAlign="left">Email</Header>
                <Input icon='mail' iconPosition='left' placeholder='email' fluid name="email" onChange={(e) => { handleFormChange(e) }} />
              
                <Header as="h3" textAlign="left">Password</Header>
                <Input iconPosition='left' placeholder='password' fluid type="password" name="password" onChange={(e) => { handleFormChange(e) }} />
               
                <Header as="h3" textAlign="left">Re-enter Password</Header>
                <Input placeholder='password' fluid type="password" name="password2" onChange={(e) => { handleFormChange(e) }} />
                
                <br />
                <br />
                
                <Button primary fluid onClick={() => { handleFormSubmit() }}>Sign Up</Button>
                <br />
                <br />
            </Section>
            {(formData.formComplete === true ? <Redirect to = "/userLogin"/>:<></>)}
        </Container>
    )
}
