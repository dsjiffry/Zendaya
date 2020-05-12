import React from 'react'

import user_helper_function  from "../Contexts/Helper_Functions/user_management"

export default function TestingComponent() {

   
    const testFunction =  () => {
        let result_AUTH_helper =  user_helper_function(
            {
                type:"AUTHENTICATE" , 
                payload : {
                    AUTH_username : "admin",
                    AUTH_password : "admin"
                }
            })
            .then(
                (res) => {console.log(res)}
            )

       
        
         
            
    }

    return (
        <div>
            This is a testing Component
            <button onClick = { testFunction }>Click Me</button>
        </div>
    )
}
