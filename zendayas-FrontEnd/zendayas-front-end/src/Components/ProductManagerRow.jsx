import React from 'react'
import { Segment as Section, Button, Table } from 'semantic-ui-react'
export default function ProductManagerRow(props) {


    const {name , price} = props;
    //console.log(price)
    return (
        <>
            <Table.Row>
                <Table.Cell>
                    {name}
                </Table.Cell>
                {
                    price !== undefined ?
                    <Table.Cell>
                    {`marked price ${price.originalPrice}`}
                    <br/>
                    {`discount ${price.discountPercentage}%`}    
                    </Table.Cell> : <></>
                }
              
                <Table.Cell>
                    <Button primary>Edit Product</Button>
                </Table.Cell>
                <Table.Cell>
                    <Button positive>Manage Categoies</Button>
                </Table.Cell>
                <Table.Cell>
                    <Button negative>Delete</Button>
                </Table.Cell>
            </Table.Row>

        </>
    )
}
