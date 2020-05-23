import React from 'react'

import { Segment as Section, Button, Table , Input } from 'semantic-ui-react'
import ProductManagerRow from './ProductManagerRow'

import product_manager from "../Contexts/Helper_Functions/product_management"

export default function ProductManager() {

    const [state, setstate] = React.useState({
        productList : {}
    })

    const [elements, setElements] = React.useState([])

    const [searchKeyword, setSearchKeyword] = React.useState("")
    

    const fetchProducts = async (searchKeyword) => 
        {
            const command_SEARCH_PRODUCT = {
                type : "SEARCH_PRODUCT",
                payload : {
                    SP_keyword : searchKeyword
                }
            }

            const result_SEARCH_PRODUCT = await product_manager(command_SEARCH_PRODUCT)

            if(result_SEARCH_PRODUCT.status === 200)
            {
                console.log(result_SEARCH_PRODUCT)
                setstate({...state, productList : result_SEARCH_PRODUCT.payload.productList})
            }
            else
            {
                console.log("Error retrieving products")
            }
        

        }

    React.useEffect(() => {
        
        fetchProducts("");

        return () => {
            
        }
    }, [])


    React.useEffect(() => {
       console.log(state)

       let rows = []
       
       Object.keys(state.productList).forEach(function(key,index) {
            
        rows.push(
            <ProductManagerRow
                key = {state.productList[key].name}
                name = {state.productList[key].name}
                price = {state.productList[key].price}
                description = {state.productList[key].description}

            />
        )

        setElements(rows)
        

    });


        return () => {
          
        }
    }, [state])

    return (
        <Table inverted>
            <Table.Header fullWidth>
                <Table.Row>
                    <Table.HeaderCell colSpan='1'>
                        <Button primary onClick={() => { fetchProducts("") }}>Refresh List</Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell colSpan='1'> Store Products </Table.HeaderCell>
                    <Table.HeaderCell colSpan='2'>
                        <Input 
                            fluid
                            value = {searchKeyword} 
                            onChange = {(e) => {setSearchKeyword(e.target.value)}}
                            placeholder = "filter Results"
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell colSpan='1'>
                        <Button secondary onClick={() => { fetchProducts(searchKeyword) }}>Search Results</Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Price Details</Table.HeaderCell>
                    <Table.HeaderCell>Edit Product</Table.HeaderCell>
                    <Table.HeaderCell>Manage Categories</Table.HeaderCell>
                    <Table.HeaderCell>Delete Product</Table.HeaderCell>
                </Table.Row>
               
            </Table.Header>

            <Table.Body>
               {
                   elements
               }
            </Table.Body>
        </Table>
    )
}
