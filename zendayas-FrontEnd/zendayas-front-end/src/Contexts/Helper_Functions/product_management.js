import Cookies from 'universal-cookie';



export default function product_management(action) {
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

    switch (action.type) {

        case "GET_PRODUCT_BY_CATEGORY":
            const { GPBC_category } = action.payload;

            //GET ALL products Which Needed from Category
            fetch(BACKEND_BASE_URL + '/getAllProductsInCategory', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    categoryName: GPBC_category,
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
                .then((response) => {
                    if (response) {

                        let json = response;

                        //Getting the images
                        var productNames = [];
                        let imageNumbers = [1, 2, 3];
                        Object.keys(response).forEach(function (key) {
                            productNames.push(key);
                        });

                        productNames.forEach(function (product) {
                            imageNumbers.forEach(function (imageNumber) {
                                fetch(BACKEND_BASE_URL + '/getImageByNumber', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'image/jpeg',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + jwt
                                    },
                                    body: JSON.stringify({
                                        productName: product,
                                        imageNumber: imageNumber
                                    }),
                                })
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.blob();
                                        } else {

                                        }
                                    })
                                    .then((responseBody) => {
                                        if (responseBody) {
                                            switch (imageNumber) {
                                                case 1:
                                                    json[product] = { ...json[product], main_image_url: URL.createObjectURL(responseBody) }
                                                    break;
                                                case 2:
                                                    json[product] = { ...json[product], second_image_url: URL.createObjectURL(responseBody) }
                                                    break;
                                                case 3:
                                                    json[product] = { ...json[product], third_image_url: URL.createObjectURL(responseBody) }
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    });

                            });

                            //Getting the Thumbnails
                            fetch(BACKEND_BASE_URL + '/getThumbnail', {
                                method: 'POST',
                                headers: {
                                    Accept: 'image/jpeg',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + jwt
                                },
                                body: JSON.stringify({
                                    productName: product
                                }),
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        return response.blob();
                                    } else {

                                    }
                                })
                                .then((responseBody) => {
                                    if (responseBody) {
                                        json[product] = { ...json[product], thumbnail_url: URL.createObjectURL(responseBody) }
                                    }
                                })
                                .catch((error) => {
                                    console.log(error)
                                });
                        });


                        return {
                            status: STATUS_OK,
                            payload: {
                                productList: json,
                            }
                        }

                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                productList: [],
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            productList: [],
                        }
                    }
                });

        case "SEARCH_PRODUCT":

            const { SP_keyword } = action.payload;

            fetch(BACKEND_BASE_URL + '/searchProductsByName', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
                body: JSON.stringify({
                    productName: SP_keyword,
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
                .then((response) => {
                    if (response) {
                        return {
                            status: STATUS_OK,
                            payload: {
                                productList: response,
                            }
                        }

                    } else {
                        return {
                            status: STATUS_NOT_FOUND,
                            payload: {
                                productList: [],
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            productList: [],
                        }
                    }
                });

        case "GET_ALL_CATEGORIES":
            fetch(BACKEND_BASE_URL + '/getAllCategories', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt_token
                },
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
                .then((response) => {
                    if (response) {
                        return {
                            status: STATUS_OK,
                            payload: {
                                categoryList: response
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
                })
                .catch((error) => {
                    console.log(error)
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {
                            categoryList: []
                        }
                    }
                });

        case "CREATE_CATEGORY":
            //Create Category in server
            const { CC_category } = action.payload;

            fetch(BACKEND_BASE_URL + '/createCategory', {
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
                        payload: {

                        }
                    }
                });

        case "DELETE_CATEGORY":
            //Delete Category 
            const { DC_category } = action.payload;

            fetch(BACKEND_BASE_URL + '/deleteCategory', {
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
                        payload: {

                        }
                    }
                });

        case "ADD_PRODUCT_TO_CATEGORY":

            const { APTC_productName, APTC_category } = action.payload;

            fetch(BACKEND_BASE_URL + '/addToCategory', {
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
                        payload: {

                        }
                    }
                });

        case "REMOVE_PRODUCT_FROM_CATEGORY":

            const { RRFC_productName, category } = action.payload;
            fetch(BACKEND_BASE_URL + '/removeFromCategory', {
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
                        payload: {

                        }
                    }
                });

        case "ADD_PRODUCT":

            const { AP_productName, AP_description, AP_price, AP_discount } = action.payload;

            const { AP_main_image, AP_second_image, AP_third_Image, AP_thumbnail } = action.payload  //In FILE format

            fetch(BACKEND_BASE_URL + '/removeFromCategory', {
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

                .then((response) => {
                    if (response.ok) {

                        //Adding Thumbnail
                        let formData = new FormData();
                        formData.append('image', AP_thumbnail);
                        formData.append('productName', AP_productName);

                        fetch(BACKEND_BASE_URL + '/addThumbnail', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data',
                                'Authorization': 'Bearer ' + jwt
                            },
                            body: formData,
                        })
                            .then((response) => {
                                if (response.ok) {
                                    console.log('added Thumbnail');
                                } else {
                                    console.log('Unable to Add Thumbnail');
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            });

                        //Adding Images
                        let images = [AP_main_image, AP_second_image, AP_third_Image];
                        images.map((image) => {
                            formData.append('image', image);
                            formData.append('productName', AP_productName);

                            fetch(BACKEND_BASE_URL + '/addImage', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': 'Bearer ' + jwt
                                },
                                body: formData,
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        console.log('added Image');
                                    } else {
                                        console.log('Unable to Add Image');
                                    }
                                })
                                .catch((error) => {
                                    console.log(error)
                                });
                        }
                        );
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
                        payload: {

                        }
                    }
                });

        case "UPDATE_PRODUCT_DATA":

            const { productName, UPD_productName, UPD_description, UPD_price, UPD_discount } = action.payload;

            fetch(BACKEND_BASE_URL + '/updateProduct', {
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
                        payload: {

                        }
                    }
                });

        case "UPDATE_IMAGE":

            const { UI_type, productName } = action.payload; // MAIN_IMAGE, SECOND_IMAGE, THIRD_IMAGE, THUMBNAIL_IMAGE

            let imageNumber = -1;
            switch (UI_type) {
                case MAIN_IMAGE:
                    imageNumber = 1;
                case SECOND_IMAGE:
                    imageNumber = 2;
                case THIRD_IMAGE:
                    imageNumber = 3;
                case THUMBNAIL_IMAGE:
                    imageNumber = 0;
            }

            let formData = new FormData();
            formData.append('image', UI_type);
            formData.append('productName', productName);
            formData.append('imageNumber', imageNumber);

            fetch(BACKEND_BASE_URL + '/updateImage', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + jwt
                },
                body: formData,
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
                    return {
                        status: STATUS_SERVER_ERROR,
                        payload: {}
                    }
                });



        default:
            break;
    }
}