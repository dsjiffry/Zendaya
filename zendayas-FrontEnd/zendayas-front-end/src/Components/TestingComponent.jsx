import React from 'react'

import user_helper_function from "../Contexts/Helper_Functions/user_management"
import FileUploader from './FileUploader'
import FileUploader2 from './FileUploader2'

import { ProductCard } from "react-ui-cards"
import Product_v2 from './Product_v2'

import {Grid,Responsive,Container} from "semantic-ui-react"


export default function TestingComponent() {


    const testFunction = async () => {

        const result_AUTH_helper = await user_helper_function(
            {
                type: "AUTHENTICATE",
                payload: {
                    AUTH_username: "admin",
                    AUTH_password: "admin"
                }
            })

        console.log(result_AUTH_helper)

    }

    let review_array = [
                    {
                        review: "awesome slippers",
                        time_stamp: "Mon May 11 02:29:12 UTC 2020",
                        username: "admin"
                    },
                    {
                        review: "bad slippers",
                        time_stamp: "Mon May 11 02:29:29 UTC 2020",
                        username: "sm222"
                    }
                ];

    let product = <Product_v2
                        productName={"Ugly Sweater"}
                        originalPrice={1200}
                        MAIN_IMAGE={`http://35.208.41.87:8080/getImage/Shirt/1`}
                        SECONDARY_IMAGE={"http://35.208.41.87:8080/getImage/Shirt/2"}
                        TERTIARY_IMAGE={"https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1569874052-fallsweaters-everlane-1569874044.jpg"}
                        THUMBNAIL={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR2Rl8S0YKTRk36ta0th3MlQ8-lmRLIIXUJQ_Ij8rnq7CYs0Sad&usqp=CAU"}
                        finalPrice={800}
                        discount={12}
                        description={"Rain bow ugly sweater"}
                        rating={2.9}
                        reviews={review_array}
                    />
        

    return (
        <Container>
        <Responsive {...Responsive.onlyMobile}>
            <Grid columns={1}>
                <Grid.Column>
                    {product}
                </Grid.Column>
                <Grid.Column>
                    {product}
                </Grid.Column>
                <Grid.Column>
                    {product}
                </Grid.Column>
                <Grid.Column>
                    {product}
                </Grid.Column>
                <Grid.Column>
                    {product}
                </Grid.Column>
            </Grid>
      
            
        {/* {<Responsive {...Responsive.onlyMobile}>
        <Grid columns = {1}>
                <Grid.Column>
                    <Product_v2 />
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
            </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyComputer}>
            <Grid columns = {4}>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
            </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
            <Grid columns = {2}>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
                <Grid.Column>
                    <Product_v2/>
                </Grid.Column>
            </Grid>
        </Responsive>} */}
            
            
        </Responsive>
        </Container>
    )
}
