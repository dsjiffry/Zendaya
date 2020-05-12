import React from 'react'

import {Segment as Section , Header , Divider , Input , Button} from "semantic-ui-react"

import {UserContext} from "../Contexts/UserStore"

export default function AddStoreManager() {
    
    const {state , dispatch} = React.useContext(UserContext)

    React.useEffect(
        () => {console.log(state,dispatch, "submit form() Admin Login use Effect")}, [state]
    )

    
    return (
        <div>
            <Section>
                <Header as="h3" textAlign="left">Create Store Manager</Header>
                <Divider />
                <Header as="h3" textAlign="left">Store Manager Name</Header>
                <Input icon='user' iconPosition='left' placeholder='store manager name' fluid />
                <br />
                <Header as="h3" textAlign="left">Store Manager Email</Header>
                <Input icon='mail' iconPosition='left' placeholder='store manager email' fluid />
                <br />
                <Header as="h3" textAlign="left">Store Manager Password</Header>
                <Input iconPosition='left' placeholder='store manager name' fluid type="password" />
                <br />
                <Header as="h3" textAlign="left">Re-enter Store Manager Password</Header>
                <Input  placeholder='store manager name' fluid type="password" />
                <br />
                <br />
                <Button primary fluid onClick = { () => {console.log(state)}}>Create Store Manager</Button>
                <br />
                <br />
            </Section>
        </div>
    )
}
