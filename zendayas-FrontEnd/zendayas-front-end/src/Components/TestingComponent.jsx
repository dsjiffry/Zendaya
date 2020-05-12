import React from 'react'

import user_helper_function  from "../Contexts/Helper_Functions/user_management"

export default function TestingComponent() {

   
    const testFunction = async (data) => {
        let result_AUTH_helper = await user_helper_function(
            {
                type:"AUTHENTICATE" , 
                payload : {
                    AUTH_username : data.username,
                    AUTH_password : data.password
                }
            })

        await console.log(result_AUTH_helper)

        
         
            
    }

    return (
        <div>
            This is a testing Component
            <button onClick = { () => console.log(testFunction({username:"admin",password:"admin"})) }>Click Me</button>
        </div>
    )
}
