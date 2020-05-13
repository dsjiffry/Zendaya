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
        productName : "sample_product",

        quantity : 1,

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

            return {
                status : STATUS_OK ,
                payload: {
                    cartItems : [
                        sample_cart_item,
                        {...sample_cart_item , productName : "cart Item 1" },
                        {...sample_cart_item , productName : "cart Item 2" },
                        {...sample_cart_item , productName : "cart Item 3" },
                    ],
                    cartTotal : 1200
                }
            }
        
        case "ADD_ITEM_TO_CART":

            const { AITC_username, AITC_productName} = action.payload;

            //assume quantity is 1
            return {
                status: STATUS_OK,
                payload: {}
            }

        case "UPDATE_ITEM_QUANTITY":

            const { UIQ_username, UIQ_productName , UIQ_newQuantity} = action.payload;
            
            return {
                status: STATUS_OK,
                payload: {}
            }
        

        case "DELETE_ITEM_FROM_CART":

            const { DIFC_username, DIFC_productName } = action.payload;

            return {
                status: STATUS_OK,
                payload: {}
            }


        default:
            break;
    }
}