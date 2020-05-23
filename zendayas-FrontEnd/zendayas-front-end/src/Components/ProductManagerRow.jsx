import React from 'react'
import { Segment as Section, Button, Table } from 'semantic-ui-react'
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';
import ProductCategoryEdit from './ProductCategoryEdit';
export default function ProductManagerRow(props) {


    const {name , price , description} = props;
    //console.log(price)
    return (
        <>
            <Table.Row>
                <Table.Cell>
                    {name}
                </Table.Cell>
                {
                    price !== undefined ?

                        <>
                            <Table.Cell>
                                {`marked price ${price.originalPrice}`}
                                <br />
                                {`discount ${price.discountPercentage}%`}
                            </Table.Cell>
                            <Table.Cell>
                                <EditProduct
                                    name = {name}
                                    price = {price}
                                    description = {description}                                
                                />
                            </Table.Cell>
                        </>

                    : <></>
                }
              
                
                <Table.Cell>
                    <ProductCategoryEdit
                          name = {name}
                    />
                </Table.Cell>
                <Table.Cell>
                    <DeleteProduct
                        name = {name}
                    />
                </Table.Cell>
            </Table.Row>

        </>
    )
}
