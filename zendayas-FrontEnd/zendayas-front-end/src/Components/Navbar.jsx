import React, { Component } from 'react'

import Cookies from "universal-cookie"

import _ from "lodash";
import {
    Container,
    Icon,
    Image,
    Menu,
    Button,
    Sidebar,
    Responsive
} from "semantic-ui-react";

import {UserContext} from "../Contexts/UserStore"

import {Redirect,Link} from "react-router-dom"

const NavBarDesktop = ({ leftItems, rightItems }) => {

   
    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");


    if (user_info_cookie !== null && user_info_cookie !== {} && user_info_cookie !== undefined ) {
        //jwt_token = user_info_cookie.jwt_token;

        console.log(user_info_cookie, "Navbar")

        return (
            <Menu fixed="top" inverted>
                <Menu.Item>
                    <Button inverted
                        onClick = {() => { console.log("Log Out") ; cookies.remove("USER") ; window.location.reload() }}
                    >
                        <Button.Content>
                            <Icon disabled name='power off' size="large" />
                        </Button.Content>
                    </Button>
                   
                </Menu.Item>
                    <Menu.Item>
                            <Link to="/">Home</Link>
                        </Menu.Item>
                    <Menu.Menu position="right">
                    <Menu.Item>
                        <Link to="/Cart">Cart</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/WishList">Wish List</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/myOrders">My Orders</Link>
                    </Menu.Item>

                </Menu.Menu>
            </Menu>
        )

    }
    else {
        console.log(user_info_cookie, "Navbar")
        return (
            <Menu fixed="top" inverted>
                <Menu.Item>
                    <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
                </Menu.Item>
                <Menu.Item>
                    <Link to="/">Home</Link>
                </Menu.Item>

                <Menu.Menu position="right">
                    <Menu.Item>
                        <Link to="/userLogin">Login</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/SignUp">Sign Up</Link>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }


};

const NavBarChildren = ({ children }) => (
    <Container style={{ marginTop: "5em" }}>{children}</Container>
);


export default class NavBar extends Component {
    state = {
        visible: false
    };

    handlePusher = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false });
    };

    handleToggle = () => this.setState({ visible: !this.state.visible });

    render() {
        const { children, leftItems, rightItems } = this.props;
        const { visible } = this.state;

        return (
            <div>
                <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
                <NavBarChildren>{children}</NavBarChildren>
            </div>
        );
    }
}

