import React from 'react'
import Cookies from "universal-cookie"
import {Segment,Header,Button,Grid,Image,Divider} from "semantic-ui-react"

import NavBar from '../Components/Navbar'
import order_manager from "../Contexts/Helper_Functions/order_management"

export default function MyOrders() {

    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    const [elements, setElements] = React.useState([])

    const fetchOrder = async () => 
    {
        if (user_info_cookie !== null && user_info_cookie !== undefined) {
            const result_GET_CART_ITEMS = await order_manager({
                type: "GET_ORDERED_ITEMS",
                payload: {
                    GOI_username: user_info_cookie.username,
                    GOI_dateTime : new Date().toISOString()
                }
            })

            let item_array = [];
            let item_state_array = [];
            console.log(result_GET_CART_ITEMS)
        }
    }

    React.useEffect(() => {
        fetchOrder()
    },[]);

    return (
        <Segment>
            <Header as = "h1">My Orders</Header>
            <Divider/>
            <Segment>

            </Segment>
        </Segment>
    )
}
