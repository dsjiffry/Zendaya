import React from 'react'


import { Segment as Section, Button, Form, Modal, Header, Icon , Grid , Input} from 'semantic-ui-react'

import Cookies from 'universal-cookie';
import product_manager from "../Contexts/Helper_Functions/product_management"


const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;




export default function ProductCategoryEdit(props) {

    const [openCategoryModal, setOpenCategory] = React.useState(false)

    const [elements,setElements] = React.useState([]);

    const [elements2,setElements2] = React.useState([]);

    const [state , setState] = React.useState({
        Categories :[]
    });

    const [categoryList , setCategoryList ] = React.useState({})
    

    // const updateCategories = async () => 
    // {
    //     console.log(categoryList)
    //     if(
    //             categoryList !== [] 
    //             && categoryList !== undefined 
    //             && categoryList !== null )
    //     {
    //         Object.keys(categoryList).forEach(
    //             async (key,index) => {
    //                 if(categoryList[key].value === true)
    //                 {
    //                     console.log(categoryList[key] , "accepted")
    //                     let result_ADD_PRODUCT_TO_CATEGORY = 
    //                         await product_manager({
    //                             type : "ADD_PRODUCT_TO_CATEGORY",
    //                             payload : {
    //                                 APTC_productName : props.name, 
    //                                 APTC_category : key
    //                             }
    //                         });
    //                     if(result_ADD_PRODUCT_TO_CATEGORY.status === 200)
    //                     {
    //                         console.log("Added Successfully " , key)
    //                     }
    //                     else
    //                     {
    //                         console.log("Unsuccssfull Adding to " , key)
    //                     }
    //                 }
    //                 else
    //                 {
    //                     console.log(categoryList[key] , "rejected")
    //                     let result_REMOVE_PRODUCT_FROM_CATEGORY = 
    //                         await product_manager({
    //                             type : "ADD_PRODUCT_TO_CATEGORY",
    //                             payload : {
    //                                 RPTC_productName : props.name, 
    //                                 RPTC_category : key
    //                             }
    //                         });
    //                     if(result_REMOVE_PRODUCT_FROM_CATEGORY.status === 200)
    //                     {
    //                         console.log("Added Removing " , key)
    //                     }
    //                     else
    //                     {
    //                         console.log("Unsuccssfull Removing " , key)
    //                     }
    //                 }
    //             }
    //         )
    //     }
    // }

    
    const handleInput = (e) => 
    {
        setState({...state,[e.target.name] : e.target.value })
    }

    const handleAddCategory = async () => 
    {
        console.log(state)

        let result_ADD_PRODUCT_TO_CATEGORY = 
                            await product_manager({
                                type : "ADD_PRODUCT_TO_CATEGORY",
                                payload : {
                                    APTC_productName : props.name, 
                                    APTC_category : state.addingCategory
                                }
                            });
                        if(result_ADD_PRODUCT_TO_CATEGORY.status === 200)
                        {
                            alert("Added Successfully " , state.addingCategory)
                            fetchProductCategories()
                        }
                        else
                        {
                            alert("Please Re check category name (use the auto suggested values instead)")
                        }
                    
    }

    const handleDelete = async (category) =>
    {
        let result_REMOVE_PRODUCT_FROM_CATEGORY = 
                            await product_manager({
                                type : "REMOVE_PRODUCT_FROM_CATEGORY",
                                payload : {
                                    RRFC_productName : props.name, 
                                    category : category
                                }
                            });
                        if(result_REMOVE_PRODUCT_FROM_CATEGORY.status === 200)
                        {
                            console.log("Removed from  " , category)
                        }
                        else
                        {
                            console.log("Unsuccssfull Removing from " , category)
                        }
        fetchProductCategories()
    }

    const fetchCategories = async () => {
        const result_GET_ALL_CATEGORIES = await product_manager({
            type: "GET_ALL_CATEGORIES",
            payload: {}
        })

        if (result_GET_ALL_CATEGORIES.status === 200) {
            //console.log(result_GET_ALL_CATEGORIES.payload)
            let catergories = [];
            result_GET_ALL_CATEGORIES.payload.categoryList.map(
                (cat) => {
                    catergories.push(
                        <>
                        <option 
                            value={cat}
                            key = {cat}
                           
                            />
                        </>
                    )
                }
            )
            setState({...state, Categories:result_GET_ALL_CATEGORIES.payload.categoryList})
            setElements(catergories)

        }
        else {
            console.log(result_GET_ALL_CATEGORIES.status)
        }
    }

    const fetchProductCategories = async () => {
        //Use this variable to get JWT token 
        let jwt_token = ""

        const cookies = new Cookies();
        let user_info_cookie = cookies.get("USER");

        if (user_info_cookie !== null && user_info_cookie !== {} && user_info_cookie !== undefined) {
            jwt_token = user_info_cookie.jwt_token;
        }
        
        let response = await fetch(BACKEND_BASE_URL + '/getCategories', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify({
                productName: props.name
            }),
        })

        let data = await response.json();
        console.log(data, "Included Categories",props.name)

        if(data !== null && data !== undefined )
        {
            let array = []
            data.forEach((element) => 
            {
                array.push(
                    <Section
                        key = {element}
                    >
                        <Grid>
                            <Grid.Column width = "10">
                                {element}
                            </Grid.Column>
                            <Grid.Column width = "6">
                                <Button negative fluid
                                    onClick = {(e) => {handleDelete(e.target.name)}}
                                    name = {element}
                                >
                                    Remove
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Section>
                )
            })

            setElements2(array)
        }

    }

    React.useEffect(() => {
            
                
        return () => {
           
        }
    }, [state])

    React.useEffect(() => {
        
        console.log(categoryList)
       
        return () => {
            
        }
    }, [state])

    React.useEffect(() => {
        fetchCategories()
        fetchProductCategories()
        return () => {
            
        }
    }, [])

    return (
        <Modal
            trigger={
                <
                    Button
                    positive
                    onClick={() => setOpenCategory(true)}
                >
                    Manage Categoies
                </Button>}
            size='small'
            open={openCategoryModal}
        >
            <Modal.Header>
                <Header icon='archive' content= {`${props.name} Category Manager`} />
            </Modal.Header>
          
            <Modal.Content>
                <Section>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width = "16">
                                <Header>Add Category</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column width = "10" inverted>
                                <Input 
                                    list='languages' 
                                    name = "addingCategory"
                                    onChange = {(e) => handleInput(e)}
                                    placeholder='Choose Categories...' fluid inverted color = "blue"/>
                                    <datalist id='languages'>
                                        {
                                           elements
                                        }
                                    </datalist>
                            </Grid.Column>
                            <Grid.Column width = "6">
                                    <Button 
                                        primary fluid
                                        onClick = {handleAddCategory}    
                                        >Add to Category
                                    </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width = "16">
                                <Header>Included Categories Category</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width = "16">
                                {
                                    elements2
                                }
                            </Grid.Column>            
                        </Grid.Row>                
                    </Grid>
                </Section>
            </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        onClick={() => { setOpenCategory(false) }}
                    >
                    <Icon name='remove' /> Cancel
                    </Button>
            
                </Modal.Actions>
        </Modal>
    )
}
