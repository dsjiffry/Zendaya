import React from 'react'

import {Container,Segment,Grid,Header,Image,Divider} from "semantic-ui-react"

import HeroImage from "../Assets/hero2.jpg"
import Product from '../Components/Product'
import ProductDisplay from '../Components/ProductDisplay'

import Navbar from "../Components/Navbar"

export default function LandingPage() {

    const leftItems = [
        { as: "a", content: "Home", key: "home" },
      ];
      const rightItems = [
        { as: "a", content: "wishList", key: "wishList" },
        { as: "a", content: "cart", key: "cart" },
        { as: "a", content: "My orders", key: "My orders" }
      ];
      

    return (
        <Navbar 
            leftItems={leftItems} 
            rightItems={rightItems}
        >
            <Container>
                    <Image fluid src = {HeroImage} style = {{height:"40vh",objectFit:"cover",width:"100vw !important"}}/>
                    <Header size="huge">Welcome to Zendaya Fashion Store</Header>
                    <Header sub >Buy All the latest Fashion Wear!!</Header>
                    <Divider/>
                    <ProductDisplay/>
            </Container>
        </Navbar>
    )
}
