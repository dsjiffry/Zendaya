import React from 'react'
import Cookies from "universal-cookie"
import {Segment,Header,Divider,Button,Grid,Image} from "semantic-ui-react"
import NavBar from '../Components/Navbar'

import wishList_Manager from "../Contexts/Helper_Functions/wishList_management"
import cart_manager from "../Contexts/Helper_Functions/cart_management"

export default function WishList() {


    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    const [elements , setElements] = React.useState([])

    const removeItemFromWishList = async (productName) => 
    {
        let command_REMOVE_WISH_LIST_ITEM = {
            type : "REMOVE_WISH_LIST_ITEM",
            payload : {
                RWLI_username :  user_info_cookie.username,
                RWLI_productName : productName
            }
        }
        
        let result_REMOVE_WISH_LIST_ITEM = await wishList_Manager(command_REMOVE_WISH_LIST_ITEM)

        //console.log(result_REMOVE_WISH_LIST_ITEM)

        if(result_REMOVE_WISH_LIST_ITEM.status === 200)
        {
            //alert("Successfully Added to Wish List")
            fetchWishListItems()
        }
        else
        {
            alert("Fail to Remove from Wish List")
        }
    }

    const addToCart = async (productName) => 
    {
        let command_ADD_ITEM_TO_CART = {
            type : "ADD_ITEM_TO_CART",
            payload : {
                AITC_username :  user_info_cookie.username,
                AITC_productName : productName
            }
        }
        
        let result_ADD_ITEM_TO_CART = await cart_manager(command_ADD_ITEM_TO_CART)

        //console.log(result_REMOVE_WISH_LIST_ITEM)

        if(result_ADD_ITEM_TO_CART.status === 200)
        {
            alert("Successfully Added to Cart")
            fetchWishListItems()
        }
        else
        {
            alert("Fail to Add To Cart")
        }
    }

    const fetchWishListItems = async () =>
    {
        if(user_info_cookie !== null && user_info_cookie !== undefined )
        {
            const result_GET_WISH_LIST_ITEMS = await wishList_Manager({
                type : "GET_WISH_LIST_ITEMS",
                payload : {
                    GWLI_username : user_info_cookie.username
                }
            })

            let item_array = [];

            if(result_GET_WISH_LIST_ITEMS.status === 200)
            {
                console.log(result_GET_WISH_LIST_ITEMS)
                Object.keys(result_GET_WISH_LIST_ITEMS.payload.cartItems).forEach((key) =>
                {
                    //console.log(key, result_GET_WISH_LIST_ITEMS.payload.cartItems[key] )
                    item_array.push(
                        <Segment>
                            <Grid>  
                                <Grid.Column width = "4">
                                    <Image fluid src = {`http://35.208.41.87:8080/getImage/${result_GET_WISH_LIST_ITEMS.payload.cartItems[key].productName}/0`} />
                                </Grid.Column>    
                                <Grid.Column width = "6">
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width = "16">
                                                <Header as = "h4"> {result_GET_WISH_LIST_ITEMS.payload.cartItems[key].productName}</Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width = "16">
                                                <Header as = "h4"> {`LKR ${result_GET_WISH_LIST_ITEMS.payload.cartItems[key].price.finalPrice}`}</Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                <Grid.Column width = "6">
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width = "16">
                                                <Button 
                                                    color = "yellow" 
                                                    fluid
                                                    name = {result_GET_WISH_LIST_ITEMS.payload.cartItems[key].productName}
                                                    onClick = {(e) => {addToCart(e.target.name)}}
                                                >
                                                    To Cart
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width = "16">
                                                <Button 
                                                    negative 
                                                    fluid
                                                    name = {result_GET_WISH_LIST_ITEMS.payload.cartItems[key].productName}
                                                    onClick = {(e) => {removeItemFromWishList(e.target.name)}}
                                                    > Remove </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                    
                                
                            </Grid>
                        </Segment>
                    )
                })

                setElements(item_array)
            }
            

        }
        
    }

    React.useEffect(() => {
        
        fetchWishListItems();

        return () => {
          
        }
    }, [])

    return (
        <NavBar>
            <Segment>
                <Header as = "h1">Wish List</Header>
                <Divider/>
                {
                    elements
                }
            </Segment>
        </NavBar>
    )
}
