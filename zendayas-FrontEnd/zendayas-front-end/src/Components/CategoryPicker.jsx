import React from 'react'
import { Input ,Segment as Section, Button, Table, Modal, Header, Icon } from 'semantic-ui-react'
import Product from './Product'

export default function CategoryPicker(props) {

    const {state,dispatch}  = props ;

    const [openModal, setOpenModal] = React.useState(false)

    const [elements,setElements] = React.useState([]);

    React.useEffect(() => {
       
        let button_list = []
        state.categoryList.forEach(element => {
            
            button_list.push(
                <Button 
                    value = {element}
                    primary
                    onClick = {(e) => {select_category(e.target.value)}}
                    >

                    {element}
                </Button>
            )

        });

        setElements(button_list)

        return () => {
            
        }
    }, [state])

   

    const select_category = (category) => 
    {
        console.log("Select_category " , category)
        dispatch({
            type : "CHANGE_SELECTED_CATEGORY",
            payload : {
                selectedCategory : category
            }

        })

        setOpenModal(false);

    }

    return (
        <Modal
            trigger={<
                Button
                color = "purple"
                fluid
                onClick={() => setOpenModal(true)}
            >
            Category Picker
            </Button>}
            basic
            open={openModal}
        >
            <Header content="Pick A Category" />
            <Modal.Content>
                {
                    elements
                }
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    color='green'  
                    onClick = {() => {setOpenModal(false)}}
                    >
                    <Icon name='checkmark' /> 
                    
                        Finish
                                </Button>
            </Modal.Actions>
        </Modal>
    )
}
