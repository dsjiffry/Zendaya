import React from "react"
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const UserContext = React.createContext();
//Central Storage of user state shared across all components

//Initial state to User context
const initialState = {
  isAuthenticated: false,
  username: null,
  password: null,
  jwt_token: null,
  type : null
};

//Reducer function to Login and store user credential in browser state  
//Never rewrite the state , Always Append 
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":   

        const user_object = {
            ...state,
            isAuthenticated: true,
            username: action.payload.user,
            password : action.payload.password,
            type : action.payload.type,
            jwt_token: action.payload.jwt
        }

        //Storing the jwt for future requests  
        cookies.set("USER", user_object , { path: '/' }); 
      
        return user_object;
     
    case "LOGOUT":
      cookies.remove("USER")
      return initialState

    case "TEST":
      console.log("TEST")
      return {...state , newField : action.payload};
    default:
      return state;
  }
};

export{reducer , initialState , UserContext}