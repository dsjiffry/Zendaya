import Cookies from 'universal-cookie';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;



export default async function product_management(action) {
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

    console.log(action.type)
    console.log(action.payload)
    console.log(jwt_token)
    

    switch (action.type) {

        case "GET_PRODUCT_BY_CATEGORY":

            const { GPBC_category } = action.payload;

            try {

                //GET ALL products Which Needed from Category
                let response = await fetch(BACKEND_BASE_URL + '/getAllProductsInCategory', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        categoryName: GPBC_category,
                    }),
                });

                if (response.ok) {

                    let data = await response.json();

                    //Getting the images
                    var productNames = [];
                    let imageNumbers = [1, 2, 3];

                    Object.keys(data).forEach(function (key) {
                        productNames.push(key);
                    });

                    productNames.forEach(function (product) {
                        imageNumbers.forEach( async (imageNumber) => {

                            let response2 = await fetch(BACKEND_BASE_URL + '/getImageByNumber', {
                                method: 'POST',
                                headers: {
                                    Accept: 'image/jpeg',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + jwt_token
                                },
                                body: JSON.stringify({
                                    productName: product,
                                    imageNumber: imageNumber
                                }),
                            });

                            if (response2.ok) {
                                let dataBlob = await response2.blob();

                                if (dataBlob) {

                                    switch (imageNumber) {
                                        case 1:
                                            data[product] = { ...data[product], main_image_url: URL.createObjectURL(dataBlob) }
                                            break;
                                        case 2:
                                            data[product] = { ...data[product], second_image_url: URL.createObjectURL(dataBlob) }
                                            break;
                                        case 3:
                                            data[product] = { ...data[product], third_image_url: URL.createObjectURL(dataBlob) }
                                            break;
                                        default:
                                            break;
                                    }

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
                                            payload: {
                                                jwt_token: ""
                                            }
                                        }
                                    }

                                }
                            }
                            else {
                                return {
                                    status: STATUS_NOT_FOUND,
                                    payload: {
                                        jwt_token: ""
                                    }
                                }
                            }

                            //-----End Of imageNumbers for each loop-------
                        });

                        //-----End Of ProductNames for each loop-------
                    })

                    //If All Loops Ran Successfully
                    return {
                        status: STATUS_OK,
                        payload: {
                            productList: data,
                        }
                    }

                    // End of If for first response.ok

                }
                else {
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {
                        }
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


        case "SEARCH_PRODUCT":

            const { SP_keyword } = action.payload;
            
            try {

                let response = await fetch(BACKEND_BASE_URL + '/searchProductsByName', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        productName: SP_keyword,
                    }),
                });

                if (response.ok) {
                
                    let data = await response.json();
    
                    return {
                        status: STATUS_OK,
                        payload: {
                            productList: data,
                        }
                    }
                }
                else {
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {
                        }
                    }
                }
                
                
            } catch (error) {
                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {
                       
                    }
                }
            }


        case "GET_ALL_CATEGORIES":
            
            try {

                let response = await fetch(BACKEND_BASE_URL + '/getAllCategories', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                })
    
                if (response.ok) {
                    let data = await response.json()
                    
                    if (data) {
                        return {
                            status: STATUS_OK,
                            payload: {
                                categoryList: data
                            }
                        }
    
                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                categoryList: []
                            }
                        }
                    }
                }
                else {
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {
                            jwt_token: ""
                        }
                    }
                }
                
            } catch (error) {
                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {
                       
                    }
                }
            }

            
               
        case "CREATE_CATEGORY":
            
            //Create Category in server
            const { CC_category } = action.payload;

            try {

                let response = await fetch(BACKEND_BASE_URL + '/createCategory', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        categoryName: CC_category,
                    }),
                })
                
                console.log(response)

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
                    payload: {

                    }
                }
                
            }


        case "DELETE_CATEGORY":
            //Delete Category 
            const { DC_category } = action.payload;

            try {

                const response = await fetch(BACKEND_BASE_URL + '/deleteCategory', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        categoryName: DC_category,
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
                    payload: {

                    }
                }
                
            }
            
                
        case "ADD_PRODUCT_TO_CATEGORY":

            const { APTC_productName, APTC_category } = action.payload;

            try {

                let response = fetch(BACKEND_BASE_URL + '/addToCategory', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        categoryName: APTC_category,
                        productName: APTC_productName
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
                    payload: {

                    }
                }
                
            }

        case "REMOVE_PRODUCT_FROM_CATEGORY":

            const { RRFC_productName, category } = action.payload;

            try {

                let response = await fetch(BACKEND_BASE_URL + '/removeFromCategory', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        categoryName: category,
                        productName: RRFC_productName
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
                    payload: {
                    }
                }
            }
            

        case "ADD_PRODUCT":

            const { AP_productName, AP_description, AP_price, AP_discount } = action.payload;

            const { AP_main_image, AP_second_image, AP_third_Image, AP_thumbnail } = action.payload  //In FILE format

            try {

                let response = await fetch(BACKEND_BASE_URL + '/addProduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        productName: AP_productName,
                        price: AP_price,
                        description: AP_description,
                        discount: AP_discount,
                    }),
                })

                if(response.ok)
                {
                    console.log(response, "success")

                    //Adding Thumbnail
                    let formData = new FormData();
                    formData.append('file', AP_thumbnail);
                    formData.append('productName', AP_productName);

                    console.log(formData, "Form Data")

                    let response2 = await fetch(BACKEND_BASE_URL + '/addThumbnail', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Authorization': 'Bearer ' + jwt_token
                        },
                        body: formData,
                    })

                    console.log(formData, "Form Data" , response )

                    if (response2.ok) {
                        
                        console.log(response2, "success")

                        //Adding Images
                        let images = [AP_main_image, AP_second_image, AP_third_Image];

                        

                        images.map(    
                            async (image) => {

                                let formData = new FormData();
                                
                                formData.append('file', image);
                                formData.append('productName', AP_productName);
            

                                let response3 = await fetch(BACKEND_BASE_URL + '/addImage', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Authorization': 'Bearer ' + jwt_token
                                    },
                                    body: formData,
                                })

    

                                if (response3.ok) {
                                    console.log(response3, "success")
                                    console.log('added Image');
                                } else {
                                    console.log('Unable to Add Image' , response3);
                                }

                            }
                        )

                        return {
                            status: STATUS_OK,
                            payload: {}
                        }

                        
                    } else {
                        console.log("Thumbnail Adding Failed" , response2)
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {}
                        }
                    }


                }
                else
                {
                    console.log("Product Adding Failed" , response)
                    return {
                        status: STATUS_NOT_FOUND,
                        payload: {}
                    }

                }
                
            } catch (error) {
                console.log(error)
                return {
                    status: STATUS_SERVER_ERROR,
                    payload: {
                    }
                }
            }

            
        case "UPDATE_PRODUCT_DATA":

            const { productName, UPD_productName, UPD_description, UPD_price, UPD_discount } = action.payload;

            try {

                let response = await fetch(BACKEND_BASE_URL + '/updateProduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: JSON.stringify({
                        productName: productName, //Current product Name
                        newProductName: UPD_productName,
                        description: UPD_description,
                        price: UPD_price,
                        discount: UPD_discount
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
                    payload: {
                    }
                }
            }


        case "UPDATE_IMAGE":

            const { UI_type, UI_productName } = action.payload; // MAIN_IMAGE, SECOND_IMAGE, THIRD_IMAGE, THUMBNAIL_IMAGE

            let imageNumber = -1;
            switch (UI_type) {
                case "MAIN_IMAGE":
                    imageNumber = 1;
                case "SECOND_IMAGE":
                    imageNumber = 2;
                case "THIRD_IMAGE":
                    imageNumber = 3;
                case "THUMBNAIL_IMAGE":
                    imageNumber = 0;
            }

            let formData = new FormData();
            formData.append('image', UI_type);
            formData.append('productName', UI_productName);
            formData.append('imageNumber', imageNumber);

            try {
                
                let response = await fetch(BACKEND_BASE_URL + '/updateImage', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + jwt_token
                    },
                    body: formData,
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
                    payload: {
                    }
                }
            }

            
          

        default:
            break;
    }
}