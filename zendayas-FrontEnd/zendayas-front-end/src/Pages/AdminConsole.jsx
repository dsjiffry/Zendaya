import React from 'react'

import { Container, Divider, Header, Grid, GridRow, GridColumn, Input, Segment as Section, Button, Table, Icon } from 'semantic-ui-react'
import AddStoreManager from '../Components/AddStoreManager'
import StoreManagerList from '../Components/StoreManagerList'

export default function AdminConsole() {
    return (
        <Container>
            <br />
            <br />
            <Section>
                <Grid divided>
                    <GridRow></GridRow>
                    <GridRow>
                        <GridColumn width="6">
                            <Header textAlign="left" as="h1">Admin Console</Header>
                            <br />
                            <br />
                            <AddStoreManager />
                        </GridColumn>
                        <GridColumn width="10" >
                            <StoreManagerList/>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Section>

        </Container>
    )

}
