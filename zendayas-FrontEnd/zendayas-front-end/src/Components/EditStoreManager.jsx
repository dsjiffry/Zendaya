import React from 'react'

import { Input ,Segment as Section, Button, Table, Modal, Header, Icon } from 'semantic-ui-react'

import user_manager from "../Contexts/Helper_Functions/user_management"

export default function EditStoreManager(props) {

    let { openEditModel, username, email, password , editModalState } = props

    const [formData , setFormData] = React.useState({
        username : username,
        password : password,
        email : email,
        new_username : username
    })

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async () => 
    {
        let command_EDIT_STORE_MANAGER = {
            type : "EDIT_STORE_MANAGER",
            payload :{
                SM_username : username,
                ESM_username : formData.new_username,
                ESM_password : password,
                ESM_email : email
            }
        }

        let result_EDIT_STORE_MANAGER = await user_manager(command_EDIT_STORE_MANAGER)

        if(result_EDIT_STORE_MANAGER.status === 200)
        {
            openEditModel(false)
        }
        else
        {
            alert("Please Re-check store manager name ")
        }

    }

    return (
        <Modal
            trigger={<
                Button
                positive
                onClick={() => openEditModel(true)}
            >
            Edit</Button>}
             size='large'
            open={editModalState}
        >
            <Header content={'Update Store Manager ' + username + " (unedited columns will remain the same)"} />
            <Modal.Content>

             <br />
                <Header as="h3" textAlign="left">New Manager Name</Header>
                <Input  value = {formData.new_username} icon='user' iconPosition='left' placeholder='' fluid name="new_username" onChange={(e) => { handleFormChange(e) }} />
             <br/>  

             <br />
                <Header as="h3" textAlign="left">New Email</Header>
                <Input value = {formData.email} icon='mail' iconPosition='left' placeholder='s' fluid name="email" onChange={(e) => { handleFormChange(e) }} />
             <br/>  

             <br />
                <Header as="h3" textAlign="left">New Password</Header>
                <Input 
                    placeholder='' fluid 
                    name="password" 
                    onChange={(e) => { handleFormChange(e) }}
                    value = {formData.password}
                    />
             <br/> 

             <Button primary fluid onClick={() => { handleFormSubmit() }}>Update Store Manager</Button>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green'  >
                    <Icon name='checkmark' /> Finish
                                </Button>
            </Modal.Actions>
        </Modal>
    )
}
