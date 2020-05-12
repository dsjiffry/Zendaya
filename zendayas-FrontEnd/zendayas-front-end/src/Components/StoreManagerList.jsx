import React from 'react'

import {  Segment as Section, Button, Table} from 'semantic-ui-react'

export default function StoreManagerList() {
    return (
        <Table inverted>
            <Table.Header fullWidth>
                <Table.HeaderCell colSpan='3'> Store Manager List </Table.HeaderCell>
            </Table.Header>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>Jhon Doe</Table.Cell>
                    <Table.Cell>Jhon@gmail.com</Table.Cell>
                    <Table.Cell>

                        <Button.Group fluid>
                            <Button negative>Delete</Button>
                            <Button.Or />
                            <Button positive>Edit</Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>

            </Table.Body>
        </Table>
    )
}
