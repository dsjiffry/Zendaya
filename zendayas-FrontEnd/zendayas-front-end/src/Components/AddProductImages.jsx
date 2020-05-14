import React, { useCallback } from 'react'


import { Button, Form, Message, Segment, Header } from 'semantic-ui-react'
import FileUploader from './FileUploader'

export default function AddProductImages(props) {

    const {parentState , setParentState} = props

    return (
        <Segment>
            <Header> 2) Add Product Images </Header>
            <FileUploader 
                title = "MAIN_IMAGE" 
                parentState = {parentState}
                setParentState = {setParentState}
                />
               <FileUploader 
                title = "SECONDARY_IMAGE" 
                parentState = {parentState}
                setParentState = {setParentState}
                />
                <FileUploader 
                title = "TERTIARY_IMAGE" 
                parentState = {parentState}
                setParentState = {setParentState}
                />
                 <FileUploader 
                title = "THUMBNAIL" 
                parentState = {parentState}
                setParentState = {setParentState}
                />
        </Segment>
    )
}
