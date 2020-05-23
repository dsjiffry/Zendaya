import React from 'react'

import { Segment as Section, Button, Table, Modal, Header, Icon } from 'semantic-ui-react'
import AddProductInfo from './AddProductInfo'

import product_manager from "../Contexts/Helper_Functions/product_management"

export default function EditProduct(props) {

    const [openEditModal, setOpenEditModal] = React.useState(false)

    const EditProduct = async () => {
      
        const command_UPDATE_PRODUCT_DATA = {
            type : "UPDATE_PRODUCT_DATA",
            payload : {
                productName : state.productName_Original, 
                UPD_productName : state.productName, 
                UPD_description : state.description, 
                UPD_price : state.price,
                UPD_discount : state.discount
            }
        }
        //console.log(command_UPDATE_PRODUCT_DATA)

        const result_UPDATE_PRODUCT_DATA = await product_manager(command_UPDATE_PRODUCT_DATA);

        if(result_UPDATE_PRODUCT_DATA.status === 200)
        {
            alert("Success")
            setOpenEditModal(false)
        }
        else
        {
            alert("Failuire", result_UPDATE_PRODUCT_DATA.status)
            setOpenEditModal(false)
        }

        
    }

    const [state, setState] = React.useState({
        productName : props.name,
        productName_Original : props.name,
        price : props.price.originalPrice,
        discount : props.price.discountPercentage,
        description : props.description
    });



    return (
        <Modal
            trigger={<
                Button
                primary
                onClick={() => setOpenEditModal(true)}
            >
                Edit Product
            </Button>}
            size='small'
            open={openEditModal}
        >
            <Header icon='archive' content='Edit Product ?' />
            <Modal.Content>
                <AddProductInfo
                    parentState = {state}
                    setParentState = {setState}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red'  onClick = {() => {setOpenEditModal(false)}}>
                    <Icon name='remove' /> No
                                </Button>
                <Button color='green' inverted onClick={EditProduct}>
                    <Icon name='checkmark' /> Yes
                                </Button>
            </Modal.Actions>
        </Modal>
    )
}
