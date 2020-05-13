import React from 'react'

import { Segment, Container, Grid , Menu, Header} from "semantic-ui-react"

export default function StoreManagerConsole() {

    

    const handleItemClick = (e,  name ) => setActiveItem( name )

    const [activeItem,setActiveItem]  = React.useState('Manage Products')

    return (
        <Container>
            <br/>
            <br/>
            <Header>Store Manager Console</Header>
            <br/>
            <br/>
            <Grid>
                <Grid.Row>
                    <Grid.Column width="4">
                        <Menu pointing secondary vertical>
                            <Menu.Item
                                name='Add Products'
                                active={activeItem === 'Add Products'}
                                onClick={(e) => handleItemClick(e , "Add Products")}
                            />
                            <Menu.Item
                                name='Manage Categories'
                                active={activeItem === 'Manage Categories'}
                                onClick={(e) => handleItemClick(e, "Manage Categories" )}
                            />
                            <Menu.Item
                                name='Manage Products'
                                active={activeItem === 'Manage Products'}
                                onClick={(e) => handleItemClick(e,"Manage Products")}
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width="12">

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}
