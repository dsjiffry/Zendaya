import React from 'react'

import { Segment as Section, Button, Table, Modal, Header, Icon } from 'semantic-ui-react'

import user_manager from "../Contexts/Helper_Functions/user_management"
import EditStoreManager from './EditStoreManager';

export default function StoreManagerRow(props) {

    const { email, username, password } = props;

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
    const [openEditModal, setOpenEditModal] = React.useState(false)
    

    const deleteUser = async () => 
    {
        let result_DELETE_STORE_MANAGER = await user_manager(
            {
                type : "DELETE_STORE_MANAGER",
                payload : {
                    DSM_username : username
                }
            }
        ) 

        setOpenDeleteModal(false);
    }

    
    return (
        <Table.Row>
            <Table.Cell>{username}</Table.Cell>
            <Table.Cell>{email}</Table.Cell>
            <Table.Cell>

                <Button.Group fluid>
                    <Modal 
                        trigger={ <
                            Button 
                            negative
                            onClick = {() => setOpenDeleteModal(true)}
                            >Delete</Button>} 
                        basic size='small'
                        open = {openDeleteModal}
                        >
                        <Header icon='archive' content='Delete Store Manager ? ' />
                        <Modal.Content>
                                <p>
                                    Are You Sure You Want Do delete Store Manager {username} ?
                                </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='red' inverted>
                                <Icon name='remove' /> No
                                </Button>
                            <Button color='green' inverted onClick={deleteUser}>
                                <Icon name='checkmark' /> Yes
                                </Button>
                        </Modal.Actions>
                    </Modal>
                    <Button.Or />
                    <EditStoreManager
                        openEditModel = {setOpenEditModal}
                        editModalState = {openEditModal}
                        username = {username}
                        email = {email}
                        password = {password}
                    />
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    )
}
