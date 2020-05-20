import React from 'react'
import { Segment, SegmentGroup, Header, Grid, Input, Button } from "semantic-ui-react"

import product_manager from "../Contexts/Helper_Functions/product_management"

export default function CategoryManager() {


    const [state, setState] = React.useState({
        newCategoryName: "",
        Categories: []
    });

    const [categoryObjects, setCategoryObjects] = React.useState([]);

    const handleFormChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const fetchCategories = async () => {
        const result_GET_ALL_CATEGORIES = await product_manager({
            type: "GET_ALL_CATEGORIES",
            payload: {}
        })

        if (result_GET_ALL_CATEGORIES.status === 200) {
            console.log(result_GET_ALL_CATEGORIES.payload)
            let catergories = [];
            result_GET_ALL_CATEGORIES.payload.categoryList.map(
                (cat) => {
                    catergories.push(
                        <Grid.Row key={cat}>
                            <Grid.Column width="12" textAlign="left">
                                {cat}
                            </Grid.Column>
                            <Grid.Column width="4">
                                <Button 
                                    negative 
                                    fluid
                                    name = {cat}
                                    onClick = {(e) => {removeCategory(e.target.name)}}
                                    >Remove</Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            )
            setState({...state,Categories:result_GET_ALL_CATEGORIES.payload.categoryList})
            setCategoryObjects(catergories)

        }
        else {
            console.log(result_GET_ALL_CATEGORIES.status)
        }
    }


    React.useEffect(
        () => {
            fetchCategories()
            //console.log(categoryObjects)
        }
    ,[])

    React.useEffect(
        () => {
            //fetchCategories()
            console.log(categoryObjects)
        }
    ,[categoryObjects])

    const addCategory = async () => {
        const result_CREATE_CATEGORY = await product_manager(
            {
                type: "CREATE_CATEGORY",
                payload: {
                    CC_category: state.newCategoryName
                }
            }
        )
        if (result_CREATE_CATEGORY.status === 200) {
            alert("Succesfully added category " + state.newCategoryName);
            fetchCategories();
        }
        else {
            console.log(result_CREATE_CATEGORY)
            alert("Fail to add category " + state.newCategoryName);
        }
    }

    const removeCategory = async (category) => {
        
        console.log(category)
        const result_DELETE_CATEGORY = await product_manager(
            {
                type: "DELETE_CATEGORY",
                payload: {
                    DC_category: category
                }
            }
        )
        if (result_DELETE_CATEGORY.status === 200) {
            alert("Succesfully Deleted category " + category);
            fetchCategories();
        }
        else {
            console.log(result_DELETE_CATEGORY)
            alert("Fail to Delete category " + category);
        }
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width="16">
                    <Segment>
                        <Header as="h2" textAlign="left">
                            Category Manager
                        </Header>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width="6">
                    <Segment inverted>
                        <Header as="h3" textAlign="left">
                            Add Categories
                        </Header>
                        <Header as="h4" textAlign="left">New Category</Header>
                        <Input
                            placeholder='new Category'
                            fluid
                            name="newCategoryName"
                            onChange={(e) => { handleFormChange(e) }}
                            value={state.newCategoryName}
                        />
                        <br />
                        <Button
                            positive
                            fluid
                            onClick={addCategory}
                        >
                            Add
                            </Button>
                    </Segment>
                </Grid.Column>
                <Grid.Column width="10">
                    <Segment>
                        <Header as="h3" textAlign="left">
                            Category List
                        </Header>
                    </Segment>
                    <Segment>
                        <Grid>
                                                        {
                                categoryObjects
                            }
                        </Grid>
                    </Segment>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    )
}
