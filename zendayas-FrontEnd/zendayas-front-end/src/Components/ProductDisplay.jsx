import React from 'react'

import { Input ,Segment, Header, Button, ButtonGroup, Grid, Dropdown, Responsive } from "semantic-ui-react"


import { ProductContext } from "../Contexts/ProductStore"

import product_manager from "../Contexts/Helper_Functions/product_management"


import CategoryPicker from "../Components/CategoryPicker"
import Product from './Product_v2'

export default function ProductDisplay() {

    const { product_state, product_dispatch } = React.useContext(ProductContext);

    const [elements, setElements] = React.useState([]);


    React.useEffect(() => {

        console.log(product_state, "update State");

        return () => {

        }
    }, [product_state])

    React.useEffect(() => {

        console.log(product_state, "update State product List");

        let t_elemets = []

        if (product_state.productList !== undefined || product_state.productList !== null) {
            product_state.productList.map(

                (element) => {
                    //console.log(element)
                    t_elemets.push(
                        <Grid.Column>
                            <Product
                                MAIN_IMAGE={`http://35.208.41.87:8080/getImage/${element.name}/1`}
                                SECONDARY_IMAGE={`http://35.208.41.87:8080/getImage/${element.name}/2`}
                                TERTIARY_IMAGE={`http://35.208.41.87:8080/getImage/${element.name}/3`}
                                productName = {element.name}
                                description = {element.description}
                                originalPrice={element.price.originalPrice}
                                finalPrice={element.price.finalPrice}
                                rating={element.average_rating}
                                reviews={element.reviews}
                            />
                        </Grid.Column>
                    )
                }
            )

            setElements(t_elemets)

        }

        return () => {

        }
    }, [product_state.productList])

    React.useEffect(() => {

        console.log("Load products from ", product_state.Selected_Category);

        const fetch_categories_2 = async () => {
            if (product_state.Selected_Category !== null || product_state.Selected_Category !== undefined) {
                const result_GET_PRODUCT_BY_CATEGORY = await product_manager(
                    {
                        type: "GET_PRODUCT_BY_CATEGORY",
                        payload: { GPBC_category: product_state.Selected_Category }
                    }
                )

                if (result_GET_PRODUCT_BY_CATEGORY.status === 200) {
                    let products = []

                    Object.keys(result_GET_PRODUCT_BY_CATEGORY.payload.productList).forEach(
                        (key, index) => {
                            //console.log(result_GET_PRODUCT_BY_CATEGORY.payload.productList[key])
                            products.push(result_GET_PRODUCT_BY_CATEGORY.payload.productList[key])
                        }
                    )

                    console.log(products)

                    product_dispatch(
                        {
                            type: "LOAD_PRODUCTS",
                            payload: {
                                productList: products
                            }
                        }
                    )
                }
                else {
                    console.log("Product Fetching Failed")
                }
            }
        }

        fetch_categories_2()

        return () => {

        }
    }, [product_state.Selected_Category])


    React.useEffect(() => {

        //Run me Only Once

        let fetch_categories = async () => {
            let result_GET_ALL_CATEGORIES = await product_manager({
                type: "GET_ALL_CATEGORIES"
            })

            if (result_GET_ALL_CATEGORIES.status === 200) {
                console.log("Fetch Categories", result_GET_ALL_CATEGORIES.payload)

                await product_dispatch({
                    type: "LOAD_CATEGORIES", payload: {
                        categoryList: result_GET_ALL_CATEGORIES.payload.categoryList
                    }
                })

                await product_dispatch({
                    type: "CHANGE_SELECTED_CATEGORY",
                    payload: {
                        selectedCategory: result_GET_ALL_CATEGORIES.payload.categoryList[0]
                    }
                })



            }
            else {
                console.log("Failed To Fetch Categories")

            }
        }

        fetch_categories();



        return () => {

        }
    }, [])


    const handleSearch = async (search) => {

        if(search.length > 3 )
        {
            

            let result_SEARCH_PRODUCT = await product_manager(
                {
                    type : "SEARCH_PRODUCT",
                    payload : {
                        SP_keyword : search
                    }
                }
            ) 
            
            if (result_SEARCH_PRODUCT.status === 200) {
                let products = []

                Object.keys(result_SEARCH_PRODUCT.payload.productList).forEach(
                    (key, index) => {
                        //console.log(result_GET_PRODUCT_BY_CATEGORY.payload.productList[key])
                        products.push(result_SEARCH_PRODUCT.payload.productList[key])
                    }
                )

                console.log(products)

                product_dispatch(
                    {
                        type: "LOAD_PRODUCTS",
                        payload: {
                            productList: products
                        }
                    }
                )
            }
            else {
                console.log("Product Fetching Failed")
            }

        }

    }

    return (
        <Segment>
            <Segment inverted textAlign="center">
                <Header size="small">Pick A Category</Header>
                <CategoryPicker
                    state={product_state}
                    dispatch={product_dispatch}
                />
            </Segment>
            <Segment inverted textAlign = "center">
                <Header as = "h4">Or Search</Header>
            <Input 
                fluid 
                action={{ icon: 'search' }} 
                placeholder='Search...' 
                onChange = {(e) => {handleSearch(e.target.value)}}
                />

                </Segment>
            <Segment >
            <Responsive {...Responsive.onlyMobile}>
                <   Grid columns={1}>
                    {elements}
                </Grid>
            </Responsive>
            <Responsive {...Responsive.onlyTablet}>
                <   Grid columns={2}>
                    {elements}
                </Grid>
            </Responsive>
            <Responsive {...Responsive.onlyComputer} >
                <   Grid columns={3}>
                    {elements}
                </Grid>
            </Responsive>
            </Segment>
        </Segment>
    )
}
