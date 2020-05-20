import React from 'react'

import { Segment, Grid , Step, Icon, Divider} from "semantic-ui-react"
import AddProductInfo from './AddProductInfo'
import AddProductImages from './AddProductImages'
import ProductPreview from './ProductPreview'

import productManager from "../Contexts/Helper_Functions/product_management"

export default function AddProduct() {


    const [state, setState] = React.useState(
        {
            infoCompleted : false,
            imagesCompleted : false,
            uploadConfirmation : false,
            productName : "",
            price : 0,
            discount : 0,
            description : "",
            finalPrice : 0,
            MAIN_IMAGE : null,
            SECONDARY_IMAGE : null,
            TERTIARY_IMAGE : null,
            THUMBNAIL : null
        }
    )


    const upload = async () =>
    {
        if(
            state.MAIN_IMAGE !== null && 
            state.SECONDARY_IMAGE !== null &&
            state.TERTIARY_IMAGE !== null &&
            state.THUMBNAIL !== null &&
            state.productName !== "" &&
            state.price !== 0 &&
            state.description !== "" 
            )
        {
            let command_ADD_PRODUCT = {
                type : "ADD_PRODUCT",
                payload  : {
                    AP_productName : state.productName, 
                    AP_description : state.description, 
                    AP_price : state.price, 
                    AP_discount : state.discount,
                    AP_main_image : state.MAIN_IMAGE, 
                    AP_second_image : state.SECONDARY_IMAGE, 
                    AP_third_Image : state.TERTIARY_IMAGE, 
                    AP_thumbnail : state.THUMBNAIL
                }
            }
            
            console.log(command_ADD_PRODUCT)
            let result_ADD_PRODUCT = await productManager(command_ADD_PRODUCT);

            console.log(result_ADD_PRODUCT)

            if(result_ADD_PRODUCT.status === 200)
            {
                alert("Success !: Now Add Relevent Categories from Product Manager")
            }
            else
            {
                alert("Failed : Naming collision ")
            }


        }
        else
        {
            alert("Complete All The Fields")
        }
    }

    React.useEffect(() => {

        //console.log(state)
        return () => {
            //cleanup
        }
    }, [state])

    React.useEffect(() => {
        
        if(state.price !== 0 && state.discount !== 0 )
        {
            let finalPrice = state.price - ( (state.price / 100) * state.discount)
            setState({...state , finalPrice : finalPrice})
        }

        //console.log(state)
        return () => {
            //cleanup
        }
    }, [state.price,state.discount])

    return (
        <Segment>
            <Grid>
                <Grid.Row>
                    <Grid.Column width="16" textAlign = "center">
                        <Step.Group fluid >
                            <Step completed = {state.infoCompleted}>
                                <Icon name='info' />
                                <Step.Content>
                                    <Step.Title>Step 1</Step.Title>
                                    <Step.Description>Add Product Details</Step.Description>
                                </Step.Content>
                            </Step>

                            <Step completed = {state.imagesCompleted}>
                                <Icon name='image' />
                                <Step.Content>
                                    <Step.Title>Step 2</Step.Title>
                                    <Step.Description>Add Images </Step.Description>
                                </Step.Content>
                            </Step>

                            <Step completed = {state.uploadConfirmation}>
                                <Icon name='upload' />
                                <Step.Content>
                                    <Step.Title>Step 3</Step.Title>
                                    <Step.Description>Confirm</Step.Description>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </Grid.Column>
                    <Grid.Column width="16">
                        <AddProductInfo
                            parentState = {state}
                            setParentState = {setState}
                        />
                        <Divider/>    
                        <AddProductImages
                            parentState = {state}
                            setParentState = {setState}
                        />
                        <ProductPreview
                             parentState = {state}
                             setParentState = {setState}
                             upload = {upload}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    )
}
