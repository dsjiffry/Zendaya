import React from 'react'
import { Segment as Section, Button, Table, Modal, Header, Icon } from 'semantic-ui-react'

import product_manager from "../Contexts/Helper_Functions/product_management"

export default function DeleteProduct(props) {

    const [openDeleteModal, setOpenDelete] = React.useState(false)

    const deleteProduct = async () => 
    {
        const result_DELETE_PRODUCT = await product_manager(
            {
                type : "DELETE_PRODUCT",
                payload:{
                    DP_productName : props.name
                }
            }
        )

        if(result_DELETE_PRODUCT.status === 200)
        {
            alert("Delete Success , Please Refresh The list")
            setOpenDelete(false)
        }
        else
        {
            alert("Delete Failuire , Please Retry at a later time")
            setOpenDelete(false)
        }

    }

    return (
        <Modal
        trigger={<
            Button
            negative
            onClick={() => setOpenDelete(true)}
        >
            Delete Product
        </Button>}
        size='small'
        open={openDeleteModal}
    >
        <Header icon='archive' content='Delete Product ?' />
        <Modal.Content>
            {`Are You sure you want to delete ${props.name}?`}
        </Modal.Content>
        <Modal.Actions>
            <Button 
                basic 
                color='red'  
                onClick = {() => {setOpenDelete(false)}}
            >
                
                <Icon name='remove' /> No
                            </Button>
            <Button color='green' inverted onClick={deleteProduct}>
                <Icon name='checkmark' /> Yes
                            </Button>
        </Modal.Actions>
    </Modal>
    )
}
