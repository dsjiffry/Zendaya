import Cookies from 'universal-cookie';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


export default async function order_management(action) {
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


    // private String username;
    // private String dateTime;
    // private HashMap<String, HashMap<String, Number>> itemsPurchased;// Name of item, price per item and quantity per
    // private double totalPrice;
    // private OrderStatus orderStatus;
    // private String address;
    // private PaymentMethod paymentMethod;
    // private String creditCardNumber;
    // private int creditCardCVC;
    // private String creditCardExpiryDate;

    let sample_Order = {
        
        ordered_items : [
            {
                productName : "sample product 1",
                quanity : 1,
                thumbnail_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDKAmpALJJ_qFnUIVmshb6icVTHlMLMwqapQZTj38pvCQslqtI&usqp=CAU"
            },
            {
                productName : "sample product 2",
                quanity : 1,
                thumbnail_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDKAmpALJJ_qFnUIVmshb6icVTHlMLMwqapQZTj38pvCQslqtI&usqp=CAU"
            }
        ],
        //quantity : 1,
        //Convert date String from server to JS date format
        order_date : new Date(),
        order_total : 1000,
        order_status : "PAYMENT_MADE",
        order_payment_method : "CREDIT_CARD",
        order_address : "Customer home",
        order_credit_card_number : "0000-0000-0000-0000",
    }

    let sample_reviewed_item = {
        productName : "sample product 1",
        review : "This product Good",
        rating : 3.5
    }

    switch (action.type) {

        case "GET_ORDERED_ITEMS":
            //Get All Products from the cart     

            const { GOI_username } = action.payload;

            return {
                status : STATUS_OK,
                order_list : [
                    sample_Order
                ]
            }

        case "ORDER_ITEMS": 
            //Order Items

            const { OI_username , OI_payment_mode , OI_address  } = action.payload;
            const { OI_CC_number , OI_CC_expiry_month , OI_CC_expiry_day } = action.payload;

            return {
                status : STATUS_OK,
                payload : {}
            }

        case "GET_USER_REVIEWS" : 
            
            const { GUR_username } = action.payload;

            return {
                status : STATUS_OK,
                payload : {
                    review_list : [
                        sample_reviewed_item,
                        {...sample_reviewed_item , productName : "sample product 2"}
                    ]
                }
            }

        case "ADD_USER_REVIEW" : 

        const { AUR_username , AUR_product_name , AUR_review , AUR_rating } = action.payload;

            return {
                status : STATUS_OK,
                payload : {}
            }

        case "UPDATE_ORDER_STATUS" :

            const { UOS_username , UOS_dateTime , UOS_status } = action.payload;

            return {
                status : STATUS_OK,
                payload : {}
            }

        case "GET_ALL_ORDERS" : 

            //To be Used By Store Manager
            return {
                status : STATUS_OK,
                payload : {
                    order_list : [
                        {
                            username : "user A",
                            email : "a@gmail.com",
                            order_status : "PAYMENT_MADE",
                            order_date : new Date(),
                            total : 1200,
                            items : [
                                {
                                    product_name : "product Name",
                                    quanity : 1
                                }
                            ]
                        },
                        {
                            username : "user B",
                            email : "b@gmail.com",
                            order_status : "PAYMENT_MADE",
                            order_date : new Date(),
                            total : 1200,
                            items : [
                                {
                                    product_name : "product Name",
                                    quanity : 1
                                }
                            ]
                        }
                    ]
                }
            }


        default:
            break;
    }
}