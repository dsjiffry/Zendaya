import Cookies from 'universal-cookie';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


export default async function cart_management(action) {
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

    let sample_cart_item = {
        productName: "sample_product",

        quantity: 1,

        price: {
            originalPrice: 100,
            discountPercentage: 12,
            finalPrice: 88
        },

        average_rating: 4.7,

        thumbnail_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDKAmpALJJ_qFnUIVmshb6icVTHlMLMwqapQZTj38pvCQslqtI&usqp=CAU",

    }

    switch (action.type) {

        case "GET_CART_ITEMS":
            //Get All Products from the cart     

            const { GCI_username } = action.payload;

            try {

                //GET ALL products in cart
                let response = await fetch(BACKEND_BASE_URL + '/getProductsAndDetails', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        username: GCI_username,
                    }),
                });

                if (response.ok) {

                    let data = await response.json();

                    //Getting the images
                    var productNames = [];

                    Object.keys(data).forEach(function (key) {
                        productNames.push(key);
                    });

                    productNames.forEach(async function (product) {

                        //Fetching Thumbnails from the server
                        let response3 = await fetch(BACKEND_BASE_URL + '/getThumbnail', {
                            method: 'POST',
                            headers: {
                                Accept: 'image/jpeg',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + jwt_token
                            },
                            body: JSON.stringify({
                                productName: product
                            }),
                        })

                        if (response3.ok) {
                            let thumbnailBlob = await response3.blob();

                            if (thumbnailBlob) {
                                data[product] = { ...data[product], thumbnail_url: URL.createObjectURL(thumbnailBlob) }
                            }
                        }
                        else {
                            return {
                                status: STATUS_NOT_FOUND,
                                payload: {}
                            }
                        }
                        //-----End Of ProductNames for each loop-------
                    });

                    //Getting cart Total
                let TotalPrice = 0;

                let response4 = await fetch(BACKEND_BASE_URL + '/getTotalPriceAndNumberOfItems', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        username: GCI_username,
                    }),
                });

                if (response.ok) {

                    let data2 = await response4.json();
                    TotalPrice = data2.totalPrice;

                }
                else {
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {}
                    }
                }

                //If All Loops Ran Successfully
                return {
                    status: STATUS_OK,
                    payload: {
                        cartItems: data,
                        cartTotal: TotalPrice
                    }
                }
                }
                else {
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {}
                    }
                }

                

            }

            catch (error) {
                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {}
                }

            }

        case "ADD_ITEM_TO_CART":

            const { AITC_username, AITC_productName } = action.payload;

            try {

                let response = await fetch(BACKEND_BASE_URL + '/addToShoppingCart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        username: AITC_username,
                        productName: AITC_productName
                    }),
                })

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

            } catch (error) {

                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {}
                }

            }

        case "UPDATE_ITEM_QUANTITY":

            const { UIQ_username, UIQ_productName, UIQ_newQuantity } = action.payload;

            console.log(UIQ_newQuantity,UIQ_productName)
            
            try {

                let response = await fetch(BACKEND_BASE_URL + '/updateCartQuantity', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        username: UIQ_username,
                        productName: UIQ_productName,
                        quantity: UIQ_newQuantity
                    }),
                })

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

            } catch (error) {

                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {}
                }

            }


        case "DELETE_ITEM_FROM_CART":

            const { DIFC_username, DIFC_productName } = action.payload;

            try {

                let response = await fetch(BACKEND_BASE_URL + '/removeFromShoppingCart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        username: DIFC_username,
                        productName: DIFC_productName
                    }),
                })

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

            } catch (error) {

                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {}
                }

            }

            case "ADD_CART_ITEM_TO_WISH_LIST":

                const { ACITWL_username, ACITWL_productName } = action.payload;
    
                try {
    
                    let response = await fetch(BACKEND_BASE_URL + '/moveToWishList', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + jwt_token
                        },
                        body: JSON.stringify({
                            username: ACITWL_username,
                            productName: ACITWL_productName
                        }),
                    })
    
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
    
                } catch (error) {
    
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
    
                }


        default:
            break;
    }
}