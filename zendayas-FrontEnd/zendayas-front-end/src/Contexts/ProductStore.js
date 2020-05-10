import React from "react"
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const ProductContext = React.createContext();
//Central Storage of Product state shared across all components



//sample Product Object

let SampleProduct =  {
    
    name : "test-product",
    
    price : {
        originalPrice : 100,
        discountPercentage : 12,
        finalPrice : 88
    },
    
    description : "test description",
    average_rating : 4.7,
    reviews:[
        {
            time_stamp : new Date(),
            username : "Jhon Doe",
            review : "This Product is OK"
        },
        {
            time_stamp : new Date(),
            username : "Jhon Doe 2",
            review : "This Product is NOT OK"
        },
    ],
    
    main_image_url : "https://www.wilddesignz.com/image/cache/catalog/placeholderproduct-500x500.png",
    second_image_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRV_WZh9T8kGfbSrZnK0sf6hOKieFyTYrtMCtdMOdslOv16IKYD&usqp=CAU",
    third_image_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSQnSu2b9xcTBDKRsGs0Ms5Wy-R5h2QcxNxvFSm9sky8FLWH-Yr&usqp=CAU",
    thumbnail_url : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDKAmpALJJ_qFnUIVmshb6icVTHlMLMwqapQZTj38pvCQslqtI&usqp=CAU",

}

//Initial state to Product context
const initialState = {
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
    categoryList : ["Shoes","watches"]
};

//Reducer function to Login and store user credential in browser state  
//Never rewrite the state , Always Append 
const reducer = (state, action) => {
  switch (action.type) {
    
    case "LOAD_IMAGES" : 
        console.log("LOAD_IMAGES")
        return {
            ...state,
            productList : action.payload.productList
        }
    case "LOAD_CATEGORIES":
        return {
            ...state,
            categoryList : action.payload.categoryList
        }

    case "TEST":
      console.log("TEST")
      return {...state , newField : action.payload};
    default:
      return state;
  }
};

export{reducer , initialState , ProductContext}