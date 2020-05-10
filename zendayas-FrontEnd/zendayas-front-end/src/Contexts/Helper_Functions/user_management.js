import Cookies from 'universal-cookie';



export default function user_management (action)
{
    //Command and Payload pattern
    //An object is sent to this method with 2 parameters
    //type -> the command o execute (Which sub function to run)
    //payload -> general object defines all the external parameters that needs to be sent

    //Extracting the parameters
    const type = action.type;
    const payload = action.payload;

    const STATUS_OK = 200;
    const STATUS_NOT_FOUND = 404;

    //Every Switch case must return an object with this fields
    //status -> the returned HTTP status of request
    //payload -> data fetched from the server (send empty object if no data is fetched)
    let return_object = {
        status : 0,
        payload : { sample_field : "sample field value"}
    }

    //Use this variable to get JWT token 
    let jwt_token = ""
    
    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    if( user_info_cookie  !== null && user_info_cookie !== {} && user_info_cookie !== undefined )
    {
        jwt_token  = user_info_cookie.jwt_token;
    }

    switch (action.type) {

        case "AUTHENTICATE":
            const { AUTH_username , AUTH_password } = action.payload;

             //GET JWT token from server as well as  http status

             return {
                status : STATUS_OK,
                payload  : {
                    jwt_token : "sample JWT token"
                }
            }

        case "GET_USER_INFO":
            //Extract The parameters from the payload object
            const { GUI_username } = action.payload;
            
            //GET user Information email , username , password  from server as well as http status
            
            //Create the return Object 
            return {
                status : STATUS_OK,
                payload  : {
                    username : "fetched username from server",
                    email : "fetched email from Server",
                    password : "password from Server",
                    type : "Admin"
                }
            }
        case "CREATE_USER":
            //Extract The parameters from the payload object
            const { CU_username , CU_password , CU_email  } = action.payload;
            
            //GET user Information email , username , password  from server as well as http status
            
            //Create the return Object 
            return {
                status : STATUS_OK,
                payload  : {}
            }

        case "CREATE_STORE_MANAGER":
            //Extract The parameters from the payload object
            const { CSM_username , CSM_password , CSM_email  } = action.payload;
            
            //GET user Information email , username , password  from server as well as http status
            
            //Create the return Object 
            return {
                status : STATUS_OK,
                payload  : {}
            }

        case "SEARCH_STORE_MANAGER":

              //Extract The parameters from the payload object
                const { SSM_search_keyword } = action.payload; 
                
                //GET list of matching Store_managers (LIKE %search_keyword%)

                return {
                    status : STATUS_OK,
                    payload  : {
                        Store_managers : [
                            {
                                username : "Jhon",
                                password : "Doe",
                                email : "Jhon@gmail.com"
                            },
                            {
                                username : "Karen",
                                password : "Doe",
                                email : "Karen@gmail.com"
                            }
                        ]
                    }
                }

        case "EDIT_STORE_MANAGER":
            //Extract The parameters from the payload object
            const { ESM_username , ESM_password , ESM_email  } = action.payload;
            
            //UPDATE Store manager Information email , username , password  from server as well as http status
            
            //Create the return Object 
            return {
                status : STATUS_OK,
                payload  : {}
            }

        case "DELETE_STORE_MANAGER" :
            //Extract The parameters from the payload object
            const { DSM_username} = action.payload;
            
            //DELETE store manager Information email , username , password  from server as well as http status
            
            //Create the return Object 
            return {
                status : STATUS_OK,
                payload  : {}
            }

        default:
            break;
    }
}