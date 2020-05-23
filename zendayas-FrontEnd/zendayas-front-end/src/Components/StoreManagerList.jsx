import React from 'react'

import {  Segment as Section, Button, Table} from 'semantic-ui-react'

import userManagement from "../Contexts/Helper_Functions/user_management"
import StoreManagerRow from './StoreManagerRow'



export default function StoreManagerList() {

    const [state, setstate] = React.useState({storeManagers:[] })

    const [elements , setElements] = React.useState([])

    let rows = [];


    async function fetchStoreManagers()
        {
            let command_GET_ALL_STORE_MANAGER = {
                type : "GET_ALL_STORE_MANAGER",
                payload : { GASM_search_keyword : "" }
            }

            let result_GET_ALL_STORE_MANAGER = await userManagement(command_GET_ALL_STORE_MANAGER);

            console.log(result_GET_ALL_STORE_MANAGER);

            if(result_GET_ALL_STORE_MANAGER.status === 200)
            {
                setstate({storeManagers : result_GET_ALL_STORE_MANAGER.payload.data})
                
                Object.keys(state.storeManagers).forEach(function(key,index) {
            
                    rows.push(
                        <StoreManagerRow
                            username = {state.storeManagers[key].username}
                            password = {state.storeManagers[key].password}
                            email = {state.storeManagers[key].email}
                            key = {state.storeManagers[key].username}
                        />
                    )
        
                });

                console.log(rows)
                 
            }
            else
            {
                result_GET_ALL_STORE_MANAGER.status === 404 ? alert("Store Mangers Not Found") : alert("Server Error")
            }
           

        }


    React.useEffect(() => {
        
        fetchStoreManagers()
      
        return () => {
            console.log("Clean Up Code useEffect StoreManagerList()")
        }
    }, [])


    React.useEffect(() => {
        
        Object.keys(state.storeManagers).forEach(function(key,index) {
            
            rows.push(
                <StoreManagerRow
                    username = {state.storeManagers[key].username}
                    password = {state.storeManagers[key].password}
                    email = {state.storeManagers[key].email}
                    key = {state.storeManagers[key].username}
                />
            )

        });
        
        console.log(rows)
    
        setElements(rows)

        return () => {
            
        }
    }, [state])



    return (
        <Table inverted>
            <Table.Header fullWidth>
                <Table.Row>
                    <Table.HeaderCell colSpan='2'> Store Manager List </Table.HeaderCell>
                    <Table.HeaderCell colSpan='2'> 
                        <Button primary onClick = {() => {fetchStoreManagers()}}>Refresh List</Button> 
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    elements
                }
            </Table.Body>
        </Table>
    )
}
