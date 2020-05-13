import React from 'react'

import { Segment as Section, Header, Divider, Input, Button, Message } from "semantic-ui-react"

import { UserContext } from "../Contexts/UserStore"

import user_manager from "../Contexts/Helper_Functions/user_management"

import {Redirect} from "react-router-dom";

export default function AddStoreManager() {

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
        "formComplete": true,
    })

    const handleFormSubmit = async () => {
        
        console.log(formData, state)

        //Resetting Warnings
        setFormData({ ...state, warning: "" })

        if (formData.password !== formData.password2) {

            setFormData({ ...state, warning:"", formComplete: false })
            setFormData({ ...state, warning: warning[1], formComplete: false })
            return 0;
        }

        if (formData.email === "" || formData.username === "" || formData.password === "") {
            setFormData({ ...state, warning:"", formComplete: false })
            setFormData({ ...state, warning: warning[0], formComplete: false })
            return 0;
        }
        else
        {
            

            let command_CREATE_USER = {
                type : "CREATE_STORE_MANAGER",
                payload : {
                    CSM_username : formData.username,
                    CSM_passeord : formData.password,
                    CSM_email : formData.email,
                    ADMIN_username : state.username,
                    ADMIN_password : state.password
                }
            }

            console.log(command_CREATE_USER)

            let result_CREATE_USER = await user_manager(command_CREATE_USER)

            if(result_CREATE_USER.status === 200)
            {
                setFormData({...formData , formComplete : true})
                alert(`Store Manager ${formData.username} Added !`)
            }
            else if (result_CREATE_USER.status === 409)
            {
                alert(`Store Manager ${formData.username} Already Exist !`)
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
        <div>
            <Section>
                <Header as="h3" textAlign="left">Create Store Manager</Header>
                <Divider />
                <br />
                {(formData.warning !== "") ? <Message>
                    <Message.Header></Message.Header>
                    <p>
                        {formData.warning}
                    </p>
                </Message> : <></> }
                
                <br />
                <Header as="h3" textAlign="left">Store Manager Name</Header>
                <Input icon='user' iconPosition='left' placeholder='store manager name' fluid name="username" onChange={(e) => { handleFormChange(e) }} />
                <br />
                <Header as="h3" textAlign="left">Store Manager Email</Header>
                <Input icon='mail' iconPosition='left' placeholder='store manager email' fluid name="email" onChange={(e) => { handleFormChange(e) }} />
                <br />
                <Header as="h3" textAlign="left">Store Manager Password</Header>
                <Input iconPosition='left' placeholder='store manager name' fluid type="password" name="password" onChange={(e) => { handleFormChange(e) }} />
                <br />
                <Header as="h3" textAlign="left">Re-enter Store Manager Password</Header>
                <Input placeholder='store manager name' fluid type="password" name="password2" onChange={(e) => { handleFormChange(e) }} />
                <br />
                <br />
                <Button primary fluid onClick={() => { handleFormSubmit() }}>Create Store Manager</Button>
                <br />
                <br />
            </Section>
            {state.type === null  ? <Redirect to = "/admin"/> : <></>  }
        </div>
    )
}
