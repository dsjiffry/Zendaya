import React from 'react'

import { Segment, Header, Button } from "semantic-ui-react"
import Product from "../Components/Product"

export default function ProductPreview(props) {

    const { parentState, setParentState , upload} = props;

    return (
        <Segment>
            <Header> Product Preview </Header>
            {
                (
                    parentState.MAIN_IMAGE !== null
                    && parentState.SECONDARY_IMAGE !== null
                    && parentState.TERTIARY_IMAGE !== null
                    && parentState.THUMBNAIL !== null
                ) ?
                    <Product
                        productName={parentState.productName}
                        originalPrice={parentState.price}
                        finalPrice={parentState.finalPrice}
                        discount={parentState.discount}
                        description={parentState.description}
                        MAIN_IMAGE={URL.createObjectURL(parentState.MAIN_IMAGE)}
                        SECONDARY_IMAGE={URL.createObjectURL(parentState.SECONDARY_IMAGE)}
                        TERTIARY_IMAGE={URL.createObjectURL(parentState.TERTIARY_IMAGE)}
                        THUMBNAIL={URL.createObjectURL(parentState.THUMBNAIL)}
                        rating={3.5}
                    /> :
                    <Header>PLease Add Images To Preview</Header>
            }

            <br />
            <Button 
                primary 
                fluid 
                onClick = {() => {upload()}}
                > Confirm And Add</Button>
        </Segment>
    )
}
