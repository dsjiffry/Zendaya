import React from 'react'
import {Segment,SegmentGroup,Header,Grid,Input , Button} from "semantic-ui-react"

import product_manager from "../Contexts/Helper_Functions/product_management"

export default function CategoryManager() {


    const [state,setState] = React.useState({
        newCategoryName : "",
        Categories : []
    });

    const handleFormChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    React.useEffect(() => {
        
        const fetchCategories = async () => 
        {
            const result_GET_ALL_CATEGORIES = await product_manager({
                type:"GET_ALL_CATEGORIES",
                payload : {}
            })
    
            if(result_GET_ALL_CATEGORIES.status === 200)
            {
                console.log(result_GET_ALL_CATEGORIES.payload)
            }
            else
            {
                console.log(result_GET_ALL_CATEGORIES.status)
            }
        }
        
        fetchCategories();

        return () => {
            
        }
    }, [])

    const addCategory = async () =>
    {
        const result_CREATE_CATEGORY = await product_manager(
            {
                type : "CREATE_CATEGORY",
                payload : {
                    CC_category : state.newCategoryName
                }
            }
        )
        if(result_CREATE_CATEGORY.status === 200)
        {
            alert("Succesfully added category " + state.newCategoryName);
        }
        else
        {
            console.log(result_CREATE_CATEGORY)
            alert("Fail to add category " + state.newCategoryName);
        }
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width = "16">
                    <Segment>
                        <Header as = "h2" textAlign = "left">
                            Category Manager
                        </Header>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width = "6">
                    <Segment inverted>
                        <Header as = "h3" textAlign = "left">
                            Add Categories
                        </Header>
                            <Header as="h4" textAlign="left">New Category</Header>
                            <Input  
                                placeholder='new Category' 
                                fluid 
                                name="newCategoryName"
                                onChange={(e) => { handleFormChange(e) }}
                                value = {state.newCategoryName}
                            />
                            <br/>
                            <Button 
                                positive 
                                fluid
                                onClick = {addCategory}
                            >
                                Add
                            </Button>
                    </Segment>
                </Grid.Column>
                <Grid.Column width = "10">
                    <Segment>
                        <Header as = "h3" textAlign = "left">
                            Category List
                        </Header>
                    </Segment>
                        <Segment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width = "12" textAlign = "left">
                                        Shoes
                                    </Grid.Column>
                                    <Grid.Column width = "4">
                                        <Button negative fluid>Remove</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                </Grid.Column>
            </Grid.Row>
            
        </Grid>
    )
}
