import Cookies from 'universal-cookie';



export default function product_management (action)
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

    if( user_info_cookie.jwt_token != null || user_info_cookie.jwt_token != "" || user_info_cookie.jwt_token != undefined )
    {
        jwt_token  = user_info_cookie.jwt_token;
    }

    //sample Product Object Structure

    let SampleProduct = {

        name: "test-product",

        price: {
            originalPrice: 100,
            discountPercentage: 12,
            finalPrice: 88
        },

        description: "test description",
        average_rating: 4.7,
        reviews: [
            {
                time_stamp: new Date(),
                username: "Jhon Doe",
                review: "This Product is OK"
            },
            {
                time_stamp: new Date(),
                username: "Jhon Doe 2",
                review: "This Product is NOT OK"
            },
        ],

        main_image_url: "https://www.wilddesignz.com/image/cache/catalog/placeholderproduct-500x500.png",
        second_image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRV_WZh9T8kGfbSrZnK0sf6hOKieFyTYrtMCtdMOdslOv16IKYD&usqp=CAU",
        third_image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSQnSu2b9xcTBDKRsGs0Ms5Wy-R5h2QcxNxvFSm9sky8FLWH-Yr&usqp=CAU",
        thumbnail_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDKAmpALJJ_qFnUIVmshb6icVTHlMLMwqapQZTj38pvCQslqtI&usqp=CAU",

    }

    switch (action.type) {

        case "GET_PRODUCT_BY_CATEGORY" :
            const { category } = action.payload;

             //GET ALL products Which Needed from Category

             return {
                status : STATUS_OK,
                payload  : {
                    productList : [
                        SampleProduct,
                        {
                            ...SampleProduct,
                            name : "test-product-2"
                        },
                        {
                            ...SampleProduct,
                            name : "test-product-3"
                        }
                    ],
                }
            }

        case "SEARCH_PRODUCT" :
            
            const { keyword } = action.payload;

            //Return Matching Keyword
            return {
                status : STATUS_OK,
                payload  : {
                    productList : [
                        SampleProduct,
                        {
                            ...SampleProduct,
                            name : "test-product-2"
                        },
                        {
                            ...SampleProduct,
                            name : "test-product-3"
                        }
                    ],
                }
            }
        
        case "GET_ALL_CATEGORIES" :
            return {
                status : STATUS_OK,
                payload : {
                    categoryList : ["Shoes","watches"]
                }
            }

        case "CREATE_CATEGORY" :
            //Create Category in server
            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }
        case "DELETE_CATEGORY" :
            //Delete Category 
            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }
        case "ADD_PRODUCT_TO_CATEGORY" :

            const { productName , category } = action.payload;
            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }
        
        case "REMOVE_PRODUCT_FROM_CATEGORY" :

            const { productName , category } = action.payload;
            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }
        
        case "ADD_PRODUCT" :   
        
            const { productName , description , price , discount } = action.payload;

            const { main_image , second_image , third_Image, thumbnail } = action.payload  //In FILE format

            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }
        
        case "UPDATE_PRODUCT_DATA" : 
            
            const { productName , description , price , discount } = action.payload;

            return {
                status : STATUS_OK,
                payload : {
                  
                }
            }

        case "UPDATE_IMAGE" : 

            const {type} = action.payload; // MAIN_IMAGE, SECOND_IMAGE, THIRD_IMAGE, THUMBNAIL_IMAGE

            return {
                status : STATUS_OK,
                payload : {     
                }
            }

        
        default:
            break;
    }
}