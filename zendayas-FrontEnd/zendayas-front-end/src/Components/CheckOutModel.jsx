import React from 'react'
import Cookies from "universal-cookie"
import { Segment, Header, Dimmer, Loader, Button, Grid, Image, TextArea, Modal, Icon, Form } from "semantic-ui-react"
import cart_manager from "../Contexts/Helper_Functions/cart_management"

import CreditCardInput from 'react-credit-card-input';
import order_manager from "../Contexts/Helper_Functions/order_management"

import {Router, Redirect} from "react-router-dom"

export default function CheckOutModel(props) {


    const [openModal, setOpenModal] = React.useState(false)

    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    const payment_states = ["Order Processing","Verifying Payment Details","Finalizing Transaction" , "Saving State"];

    const [state, setState] = React.useState({ total: 0 })
    const [elements, setElements] = React.useState([])

    const [paymentProcessing, setPaymentProcessing] = React.useState(false);

    const [accepted, setAccepted] = React.useState(false)

    const handleOrder = async () => {
        console.log(state, user_info_cookie.username)
        let exp = String(state.expiry).split(" / ");
        console.log(Number(exp[0]), Number(exp[1]))

        //CREDIT_CARD

        let command_ORDER_ITEMS = {
            type: "ORDER_ITEMS",
            payload: {
                OI_username: user_info_cookie.username,
                OI_payment_mode: "CREDIT CARD",
                OI_address: state.address,
                OI_CC_number: state.cardNumber,
                OI_CC_expiry_month: Number(exp[0]),
                OI_CC_expiry_year: Number(exp[1]),
                OI_CC_cvc: state.cvc
            }
        }

        let result_ORDER_ITEMS = await order_manager(command_ORDER_ITEMS);

        if(result_ORDER_ITEMS.status === 200)
        {
            setPaymentProcessing(true)
        }
        else
        {
            console.log(result_ORDER_ITEMS)
            alert("Order Failed , Please Try Again")
        }

    }

    React.useEffect(() => {

        fetchCartListItems();

        return () => {

        }
    }, [props])


    React.useEffect(() => {

        //console.log(state)

        return () => {

        }
    }, [state])

    const fetchCartListItems = async () => {
        if (user_info_cookie !== null && user_info_cookie !== undefined) {
            const result_GET_CART_ITEMS = await cart_manager({
                type: "GET_CART_ITEMS",
                payload: {
                    GCI_username: user_info_cookie.username
                }
            })

            let item_array = [];
            //let item_state_array = [];
            console.log(result_GET_CART_ITEMS)

            if (result_GET_CART_ITEMS.status === 200) {
                setState({ ...state, total: result_GET_CART_ITEMS.payload.cartTotal })

                Object.keys(result_GET_CART_ITEMS.payload.cartItems).forEach((key) => {
                    //console.log(result_GET_CART_ITEMS.payload.cartItems[key])

                    let item = result_GET_CART_ITEMS.payload.cartItems[key]
                    item_array.push(
                        <Segment>
                            <Grid>
                                <Grid.Row columns='equal'>
                                    <Grid.Column>
                                        <Image src={`http://35.208.41.87:8080/getImage/${item.productName}/0`} size="small" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header>{item.productName}</Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header>{`${item.price.finalPrice}  x ${item.quantity} = LKR ${Number(item.price.finalPrice) * Number(item.quantity)}`}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    )

                })

                //setState({...state})
                setElements(item_array)
            }


        }
    }

    React.useEffect(() => {
        //effect
        console.log(props.state)
        return () => {
            //cleanup
        }
    }, [openModal])

    return (
        <Modal
            open={openModal}
            trigger={
                <Button
                    onClick={() => { setOpenModal(true) }}
                    positive
                    fluid
                    disabled={props.state.total === 0}
                >
                    Proceed To Checkout
                </Button>
            }>
            <Modal.Header>Check Out</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        Please Provide Necessary Details and Confirm Your Order
                        </p>
                </Modal.Description>
                <Segment>
    
                    <Header>Net Total : LKR {state.total}</Header>
                    <Segment>
                        <Header textAlign="left" as="h5">Credit Card Details</Header>
                        <CreditCardInput
                            cardNumberInputProps={{ value: state.cardNumber, onChange: (e) => { setState({ ...state, cardNumber: e.target.value });; setAccepted(true) } }}
                            cardExpiryInputProps={{ value: state.expiry, onChange: (e) => { setState({ ...state, expiry: e.target.value });; setAccepted(true) } }}
                            cardCVCInputProps={{ value: state.cvc, onChange: (e) => { setState({ ...state, cvc: e.target.value });; setAccepted(true) } }}
                            fieldClassName="input"
                            onError={(err) => { setAccepted(false) }}
                        />
                    </Segment>
                    <Segment>
                        <Form>
                            <Form.Field
                                label="Delivery Address"
                                control={TextArea}
                                value={state.address}
                                onChange={(e) => { setState({ ...state, address: e.target.value }); (e.target.value !== null) ? setAccepted(true) : setAccepted(false) }} >

                            </Form.Field>
                        </Form>


                    </Segment>

                    <Button fluid disabled={!accepted} positive onClick={handleOrder}>Order</Button>
                    {
                        elements
                    }
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => { setOpenModal(false) }}>
                    Cancel <Icon name='cancel' />
                </Button>
            </Modal.Actions>
            {paymentProcessing?<Redirect to = "/myOrders" /> : <></>}
        </Modal>
    )
}
