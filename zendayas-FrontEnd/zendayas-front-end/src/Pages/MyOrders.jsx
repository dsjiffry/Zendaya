import React from 'react'
import Cookies from "universal-cookie"
import {Segment,Header,Button,Grid,Image,Divider,Icon} from "semantic-ui-react"

import NavBar from '../Components/Navbar'
import order_manager from "../Contexts/Helper_Functions/order_management"
import ReviewModal from '../Components/ReviewModal'

export default function MyOrders() {

    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    const [elements, setElements] = React.useState([])

    const fetchOrder = async () => 
    {
        if (user_info_cookie !== null && user_info_cookie !== undefined) {
            const result_GET_CART_ITEMS = await order_manager({
                type: "GET_ALL_USER_ORDERS",
                payload: {
                    GAUO_username: user_info_cookie.username
                }
            })

            let item_array = [];
            let item_state_array = [];
            console.log(result_GET_CART_ITEMS)
            Object.keys(result_GET_CART_ITEMS.payload.order_list)
                .forEach(element => {
                    console.log(element, result_GET_CART_ITEMS.payload.order_list[element])
                    let item =  result_GET_CART_ITEMS.payload.order_list[element];
                    let orders = result_GET_CART_ITEMS.payload.order_list[element].items;
                    let orders_array = []

                    Object.keys(orders).forEach(element => {
                        let t_item = orders[element];
                        console.log(t_item)
                        orders_array.push(
                            <Segment>
                                <Grid>
                                    <Grid.Row columns='equal'>
                                        <Grid.Column>
                                            <Image src={`http://35.208.41.87:8080/getImage/${element}/0`} size="small" />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header>{`${element} X ${orders[element].quanity}`}</Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <ReviewModal
                                                username = {user_info_cookie.username}
                                                productName = {element}
                                                productImage = {<Image avatar src={`http://35.208.41.87:8080/getImage/${element}/0`} size="small" />}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                        </Segment>
                        )
                    });

                    item_array.push(
                        <Segment >
                            <Grid textAlign = "left" >
                                <Grid.Row >
                                    <Grid.Column width = "8">
                                        
                                        <Header as = "h5" ><Icon name = "calendar outline" /> {new Date(item.order_date).toDateString()}</Header>
                                    </Grid.Column>
                                   
                                    <Grid.Column width = "8" textAlign = "right">
                                        <Header as = "h5"><Icon name = "shopping bag" />{`Status : ${item.order_status}`}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    {
                                        orders_array
                                    }
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    )
            });
            setElements(item_array)
        }
    }

    React.useEffect(() => {
        fetchOrder()
    },[]);

    return (
        <NavBar>
            <Segment>
                <Header as = "h1">My Orders</Header>
                <Divider/>
                <Segment>
                    {elements}
                </Segment>
            </Segment>
        </NavBar>
    )
}
