import React from 'react'


import { Segment as Section, Button, Form, Modal, Header, Icon } from 'semantic-ui-react'

import product_manager from "../Contexts/Helper_Functions/product_management"


export default function ProductCategoryEdit(props) {

    const [openCategoryModal, setOpenCategory] = React.useState(false)

    const [elements,setElements] = React.useState([]);

    const [state , setState] = React.useState({
        Categories :[]
    });

    const [categoryList , setCategoryList ] = React.useState({})
    

    const updateCategories = async () => 
    {
        console.log(categoryList)
        if(
                categoryList !== [] 
                && categoryList !== undefined 
                && categoryList !== null )
        {
            Object.keys(categoryList).forEach(
                async (key,index) => {
                    if(categoryList[key].value === true)
                    {
                        console.log(categoryList[key] , "accepted")
                        let result_ADD_PRODUCT_TO_CATEGORY = 
                            await product_manager({
                                type : "ADD_PRODUCT_TO_CATEGORY",
                                payload : {
                                    APTC_productName : props.name, 
                                    APTC_category : key
                                }
                            });
                        if(result_ADD_PRODUCT_TO_CATEGORY.status === 200)
                        {
                            console.log("Added Successfully " , key)
                        }
                        else
                        {
                            console.log("Unsuccssfull Adding to " , key)
                        }
                    }
                    else
                    {
                        console.log(categoryList[key] , "rejected")
                        let result_REMOVE_PRODUCT_FROM_CATEGORY = 
                            await product_manager({
                                type : "ADD_PRODUCT_TO_CATEGORY",
                                payload : {
                                    RPTC_productName : props.name, 
                                    RPTC_category : key
                                }
                            });
                        if(result_REMOVE_PRODUCT_FROM_CATEGORY.status === 200)
                        {
                            console.log("Added Removing " , key)
                        }
                        else
                        {
                            console.log("Unsuccssfull Removing " , key)
                        }
                    }
                }
            )
        }
    }

    const handleCheckbox = (e) => 
    {
    
        console.log(categoryList)
        let temp = categoryList;
        temp[e.target.value] = {
                    category : e.target.value,
                    value : e.target.checked
                }
        setCategoryList(temp)
        // setCategoryList({ ...categoryList, categoryList[e.target.value] : 
        //     {
        //         category : e.target.value,
        //         value : e.target.checked
        //     }
        // })
       // console.log(e.target.value , e.target.checked)
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
                        <Form.Field 
                            key = {cat}
                            label={cat} 
                            control='input' 
                            type='checkbox'
                            name = "categories"
                            value = {cat}
                            onChange = {(e) => {handleCheckbox(e)}}
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

    React.useEffect(() => {
            let cat_obj = {}

            
                state.Categories.map(
                    (cat) => 
                    cat_obj[cat] =   {category : cat , value : false}
                
            )
            
            //console.log(cat_obj)
            
            setCategoryList(cat_obj)
            
                
        return () => {
           
        }
    }, [state])

    React.useEffect(() => {
        
        //console.log(categoryList)

        return () => {
            
        }
    }, [categoryList])

    React.useEffect(() => {
        fetchCategories()
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
                <Header icon='archive' content='Category Manager' />
            </Modal.Header>
           <Modal.Description>
               Tick The Categories {props.name} Belong to
           </Modal.Description>
            <Modal.Content>
                <Form>
                        <Form.Group grouped>
                           
                            {
                                elements
                            }
                        </Form.Group>
                 
                </Form>
            </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        onClick={() => { setOpenCategory(false) }}
                    >

                        <Icon name='remove' /> Cancel
                            </Button>
                    <Button color='green' inverted onClick={() => { updateCategories()}}>
                        <Icon name='checkmark' /> Confirm
                            </Button>
                </Modal.Actions>
        </Modal>
    )
}
