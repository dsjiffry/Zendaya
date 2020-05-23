import React from 'react'

import { Button, Form, Message, Segment , Header} from 'semantic-ui-react'

export default function AddProductInfo(props) {

    const { parentState, setParentState } = props;


    const handleFormChange = (e) => {
        setParentState({ ...parentState, [e.target.name]: e.target.value })
    }


    return (
        <Segment textAlign = "left" fluid  inverted padded >

            <Form fluid success = {parentState.nfoCompleted} inverted >

                <Header as = "h2" inverted>1) Add Product Information</Header>
            
                <Form.Input 
                    label='Product Name' 
                    name = "pro" 
                    placeholder='Versachi Shoes' 
                    name = "productName"
                    value = {parentState.productName}
                    onChange = {(e) => {handleFormChange(e)}}
                    />
                <Form.Input 
                    label='Price in LKR' 
                    placeholder='1800' 
                    type = "number"
                    name = "price"
                    value = {parentState.price}
                    onChange = {(e) => {handleFormChange(e)}}
                />
                <Form.Input 
                    label='Discount %' 
                    placeholder='22' 
                    type = "number"
                    name = "discount"
                    value = {parentState.discount}
                    onChange = {(e) => {handleFormChange(e)}}
                    />
                <Form.TextArea 
                    label='description' 
                    placeholder='Description of product'
                    name = "description"
                    value = {parentState.description}
                    onChange = {(e) => {handleFormChange(e)}}
                    />
                <Message
                    success
                    header='Form Completed'
                    content="You're all signed up for the newsletter"
                />
                <Message
                    error
                    header='Form Incomplete'
                    content="Please Re Enter Details"
                />
    
            </Form>
        </Segment>
    )
}
