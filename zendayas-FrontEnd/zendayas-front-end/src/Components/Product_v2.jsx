import React from 'react'



import { Segment, Reveal, Card, Header, Image, Icon, Transition, Button, Grid , Rating, GridRow, Placeholder } from "semantic-ui-react"
import ProductDetails from './ProductDetails';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


export default function Product_v2(props) {

    const [page, setPage] = React.useState(0)

    // const [images,setImages] = React.useState({
    //     MAIN_IMAGE : "",
    //     SECONDARY_IMAGE : "",
    //     TERTIARY_IMAGE : "",
    //     THUMBNAIL : ""
    // })

    const {
        productName,
        originalPrice,
        THUMBNAIL,
        MAIN_IMAGE ,
        SECONDARY_IMAGE ,
        TERTIARY_IMAGE ,
        finalPrice,
        discount,
        description,
        rating,
        reviews
    } = props;


    // let imageFetcher = async (number,productName) => 
    //     {
    //         let response = await fetch(BACKEND_BASE_URL + `/getImage/${productName}/${number}`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'image/webp,*/*',
    //                 'Content-Type': 'application/json'
    //             }
                
    //         });

    //         console.log(response);

    //         let data = await response.blob();

    //         console.log(data)

    //         let image = URL.createObjectURL(data)

    //         console.log(image)

    //         setImages({...images, MAIN_IMAGE : image})

    //     }

    React.useEffect(() => {

        //imageFetcher(1,"Shirt")

        // let timer = setInterval(() => {

           
        //    setPage(page + 1)

        // }, 1000 * 1.5);

        return () => {
            // console.log("Clear")
            // clearInterval(timer)
        }
    },[])

    return (
        <>
           
                <Card fluid onClick={() => { setPage(1) }}>
                    <Transition visible={page === 0} unmountOnHide animation='scale' duration={350}>
                        <Image src={MAIN_IMAGE} fluid />
                    </Transition>
                    <Transition visible={page === 1} unmountOnHide animation='scale' duration={350}>
                        <Image src={SECONDARY_IMAGE} fluid />
                    </Transition>
                    <Transition visible={page === 2} unmountOnHide animation='scale' duration={350}>
                        <Image src={TERTIARY_IMAGE} fluid />
                    </Transition>
                    
                    <Card.Content>
                        <Card.Header>{productName}</Card.Header>
                        <Card.Meta>
                            <span className='date'>{description}</span>
                            <br/>
                            <Rating icon='heart' defaultRating={rating} maxRating={5} />
                            <Header color = "grey" as = "h4" textAlign="center"><strike>{`LKR ${originalPrice}`}</strike></Header>

                        </Card.Meta>
                        <>
                            <Grid centered>
                               <Grid.Row centered> 
                                    <Grid.Column width = "16" centered>
                                       
                                   </Grid.Column>
                                   <Grid.Column width = "16" centered>
                                        <Header as = "h3" textAlign="center">{`LKR ${finalPrice}`}</Header>
                                   </Grid.Column>
                               </Grid.Row>
                               <Grid.Row>
                               <Grid.Column width={8} textAlign = "center">
                                        <Button fluid color = "yellow" centered>
                                          
                                                <Icon  name='shop'  />
                                           
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Button fluid inverted color = "youtube" centered>
                                          
                                                <Icon name='heart' />
                                            
                                        </Button>
                                    </Grid.Column>
                               </Grid.Row>
                                <Grid.Row centered >
                                    
                                    <Grid.Column width={16}>
                                        <ProductDetails
                                            MAIN_IMAGE = { <Image src={MAIN_IMAGE} fluid />}
                                            SECONDARY_IMAGE = {<Image src={SECONDARY_IMAGE} fluid />}
                                            TERTIARY_IMAGE = {<Image src={TERTIARY_IMAGE} fluid />}
                                            reviews = {reviews}
                                        />
                                    </Grid.Column>
                                  
                                </Grid.Row>
                            </Grid>
                        </>
                    </Card.Content>
                    <Card.Content extra >
                        

                    </Card.Content>
                </Card>
           
        </>


    )
}
