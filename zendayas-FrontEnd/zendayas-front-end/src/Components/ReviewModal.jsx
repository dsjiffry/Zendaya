import React from 'react'
import { Button, Header, Image, Modal, Form ,Rating } from 'semantic-ui-react'
import order_manager from "../Contexts/Helper_Functions/order_management"


export default function ReviewModal(props) {

    const {username,productName,productImage} = props;

    const [openModal,setOpenModal] = React.useState(false)

    const [state, setState] = React.useState({rating:0})
    const handleRate = (e, { rating, maxRating }) =>
    {
        setState({...state,rating:rating})
    }

    const addReview = async () => 
    {
        let command_ADD_USER_REVIEW = {
            payload :
            {
                AUR_username : username, 
                AUR_product_name : productName, 
                AUR_review : String(state.review), 
                AUR_rating : state.rating
            },
            type : "ADD_USER_REVIEW"
           
        }

        //console.log(command_ADD_USER_REVIEW)

        let result_ADD_USER_REVIEW = await order_manager(command_ADD_USER_REVIEW);

        if(result_ADD_USER_REVIEW.status === 200)
        {
            alert("review Added Successfully")
            setOpenModal(false)
        }
        else
        {
            alert("review Adding Failed")
        }

    }
    return (
        <Modal 
            trigger={
                <Button 
                    fluid 
                    primary 
                    onClick = {() => {setOpenModal(true)}}>
                        Add Review
                </Button>} 
                centered={false} 
                open = {openModal}
        >
            <Modal.Header>{productImage} {productName}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header>Please Leave a Review</Header>
                </Modal.Description>
                <br/>
                <Form>
                    <Form.Field>
                        <label>Rating</label>
                        <Rating icon='star' defaultRating={3} maxRating={5} onRate={handleRate} size = "large"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Review</label>
                        <textarea placeholder = "Leave a Hearty Review" name = "review" onChange = {(e) => { setState({...state, [e.target.name] : [e.target.value]}) }}></textarea>
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick = {() => {setOpenModal(false)}}>
                    close
                </Button>
                <Button positive onClick = {() => {addReview()}}>
                    Publish
                </Button>
            </Modal.Actions>
        </Modal>
    )
}
