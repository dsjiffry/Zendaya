import React from 'react'
import { Button, Header, Icon, Image, Modal, Grid, Comment, Segment, Message,Divider } from 'semantic-ui-react'



export default function ProductDetails(props) {

    const { productName, reviews, MAIN_IMAGE, SECONDARY_IMAGE, TERTIARY_IMAGE } = props

    const [elements , setElements] = React.useState([])

    React.useEffect(() => {
       
        let reviewss = [];

   

        if(reviews !== null && reviews !== undefined && reviews !== [])
        {
            Object.keys(reviews).forEach((key,Index) => {
                console.log(key, reviews[key])   
                
                 
                reviewss.push(
                    <Message key = {`${reviews[key].username}-${reviews[key].time_stamp}`} >
                        <Header as="h6" color="grey">{reviews[key].time_stamp.toString().substring(0, 10)}</Header>
                        <Message.Header>{reviews[key].username}</Message.Header>
                            <em>
                                {`" ${reviews[key].review} "`}
                            </em>
                    </Message>
                )
            });

            reviewss.push(
                <Message key = {`1234`} positive>
                    <Header as="h6" color="grey">{new Date().toString().substring(0, 10)}</Header>
                    <Message.Header>"Try It Yourself!"</Message.Header>
                        <em>
                            {`" Purchase the product and leave a  Review  ! "`}
                        </em>
                </Message>
            )

            //console.log(reviewss)
            setElements(reviewss)
        }
        else
        {
            
            //setElements(reviewss)
        }
        
        return () => {
          
        }
    }, [reviews])


    return (
        <Modal trigger={<Button primary fluid>More Info</Button>}>
            <Modal.Header>{productName}</Modal.Header>
            <Modal.Content image scrolling>
                <Modal.Description>
                    <Header>Modal Header</Header>

                </Modal.Description>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            {MAIN_IMAGE}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            {SECONDARY_IMAGE}
                        </Grid.Column>
                        <Grid.Column width={5}>
                            {TERTIARY_IMAGE}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header as="h2">Reviews</Header>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={16}>
                            {
                                elements
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Modal.Content>
            <Modal.Actions>
                <Button primary>
                    Proceed <Icon name='chevron right' />
                </Button>
            </Modal.Actions>
        </Modal>
    )
}
