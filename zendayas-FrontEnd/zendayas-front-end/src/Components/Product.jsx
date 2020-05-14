import React from 'react'

import { Card, Image, Icon, Header, Reveal, Segment } from "semantic-ui-react"

export default function Product(props) {


    const {
        productName,
        originalPrice,
        MAIN_IMAGE,
        SECONDARY_IMAGE,
        TERTIARY_IMAGE,
        THUMBNAIL,
        finalPrice,
        discount,
        description,
        rating
    } = props;

    return (
        <Card fluid>
            <Segment fluid>
                <Reveal animated='fade'>
                    <Reveal.Content hidden>
                        <Image
                            centered
                            fluid
                            src={SECONDARY_IMAGE}
                            wrapped
                            ui={true}
                             />
                    </Reveal.Content>
                    <Reveal.Content visible>
                        <Image src={MAIN_IMAGE}
                            wrapped
                            centered
                            ui={true}
                            fluid
                        />
                    </Reveal.Content>
                </Reveal>
            </Segment>


            <Card.Content>
                <Card.Header>{productName}</Card.Header>
                <Card.Meta>
                    <span className='description'>{description}</span>
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Header as="h2">
                    {`LKR ${finalPrice}`}
                </Header>
            </Card.Content>
        </Card>
    )
}
