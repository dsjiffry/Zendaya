import Cookies from 'universal-cookie';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


export default async function user_management(action) {
    //Command and Payload pattern
    //An object is sent to this method with 2 parameters
    //type -> the command o execute (Which sub function to run)
    //payload -> general object defines all the external parameters that needs to be sent

    //Extracting the parameters
    const type = action.type;
    const payload = action.payload;

    const STATUS_OK = 200;
    const STATUS_NOT_FOUND = 404;
    const STATUS_SERVER_ERROR = 500;
    const STATUS_CONFLICT = 409;

    //Every Switch case must return an object with this fields
    //status -> the returned HTTP status of request
    //payload -> data fetched from the server (send empty object if no data is fetched)
    let return_object = {
        status: 0,
        payload: { sample_field: "sample field value" }
    }

    //Use this variable to get JWT token 
    let jwt_token = ""

    const cookies = new Cookies();
    let user_info_cookie = cookies.get("USER");

    if (user_info_cookie !== null && user_info_cookie !== {} && user_info_cookie !== undefined) {
        jwt_token = user_info_cookie.jwt_token;
    }

    

    switch (action.type) {

        case "AUTHENTICATE":
            const { AUTH_username, AUTH_password } = action.payload;

                    
            console.log(action.type)
            console.log(action.payload)

            //GET JWT token from server as well as  http status
            fetch(BACKEND_BASE_URL + '/authenticate', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: AUTH_username,
                    password: AUTH_password
                }),
            })
                .then((response) => {

                    if (response.ok) {
                        return response.json()
                    } 
                    else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                jwt_token: ""
                            }
                        }
                    }
                })
                .then(
                    (response)  => {
                        console.log(response)
                        return {
                            status: STATUS_OK,
                            payload: {
                                jwt_token: response.jwt
                            }
                        }
                    }
                )
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            jwt_token: ""
                        }
                    }
                });


        case "GET_USER_INFO":
            //Extract The parameters from the payload object
            const { GUI_username } = action.payload;

            //GET user Information email , username , password  from server as well as http status
            fetch(BACKEND_BASE_URL + '/getUserInfo', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    username: GUI_username,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {
                                username: response.json().username,
                                email: response.json().email,
                                password: response.json().password,
                                type: response.json().type
                            }
                        }
                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                username: "",
                                email: "",
                                password: "",
                                type: ""
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            username: "",
                            email: "",
                            password: "",
                            type: ""
                        }
                    }
                });


        case "CREATE_USER":
            //Extract The parameters from the payload object
            const { CU_username, CU_password, CU_email } = action.payload;

            //GET user Information email , username , password  from server as well as http 
            fetch(BACKEND_BASE_URL + '/createUser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: CU_username,
                    password: CU_password,
                    email: CU_email
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {}
                        }
                    } else {
                        return {
                            status: STATUS_CONFLICT,
                            payload: {}
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
                });



        case "CREATE_STORE_MANAGER":
            //Extract The parameters from the payload object
            const { CSM_username, CSM_password, CSM_email, ADMIN_username, ADMIN_password } = action.payload;

            //GET user Information email , username , password  from server as well as http status
            fetch(BACKEND_BASE_URL + '/createStoreManager', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adminUsername: ADMIN_username,
                    adminPassword: ADMIN_password,
                    StoreManagerUsername: CSM_username,
                    StoreManagerPassword: CSM_password,
                    StoreManagerEmail: CSM_email
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {}
                        }
                    } else {
                        return {
                            status: STATUS_CONFLICT,
                            payload: {}
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
                });

        case "GET_ALL_STORE_MANAGER":

            //Extract The parameters from the payload object
            const { GASM_search_keyword } = action.payload;

            //GET list of matching Store_managers (LIKE %search_keyword%)
            fetch(BACKEND_BASE_URL + '/searchStoreManagersByName', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    StoreManagerName: GASM_search_keyword //If empty string, will return all store managers
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {
                                Store_managers: response.json()
                            }
                        }

                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                Store_managers: []
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            Store_managers: []
                        }
                    }
                });

        case "EDIT_STORE_MANAGER":
            //Extract The parameters from the payload object
            const { SM_username, ESM_username, ESM_password, ESM_email } = action.payload;

            //UPDATE Store manager Information email , username , password  from server as well as http status
            fetch(BACKEND_BASE_URL + '/updateUser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    username: SM_username, //The current username
                    newUsername: ESM_username,
                    newPassword: ESM_password,
                    newEmail: ESM_email
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {}
                        }

                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {}
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
                });

        case "DELETE_STORE_MANAGER":
            //Extract The parameters from the payload object
            const { DSM_username } = action.payload;

            //DELETE store manager Information email , username , password  from server as well as http status
            fetch(BACKEND_BASE_URL + '/deleteUser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    username: DSM_username
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return {
                            status: STATUS_OK,
                            payload: {}
                        }

                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {}
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
                });

        default:
            break;
    }
}