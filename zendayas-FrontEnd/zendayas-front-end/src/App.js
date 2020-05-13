import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import TestPage from './Pages/TestPage';

import {initialState as userInitialState, UserContext , reducer as userReducer} from "./Contexts/UserStore"

import {initialState as productInitialState , ProductContext , reducer as productReducer} from "./Contexts/ProductStore" 
import AdminLogin from './Pages/AdminLogin';
import AdminConsole from './Pages/AdminConsole';
import StoreManagerConsole from './Pages/StoreManagerConsole';

function App() {

  const [state, dispatch] = React.useReducer(userReducer, userInitialState);

  const [product_state, product_dispatch] = React.useReducer(productReducer, productInitialState);
  

  return (
    <Router>
      <UserContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <ProductContext.Provider
          value={{
            product_state,
            product_dispatch
          }}
        >
          <div className="App">
            <Switch>
              <Route path="/test">
                {/* This page is for Testing Purposes Only */}
                <TestPage />
              </Route>
              <Route path = "/adminConsole">
                <AdminConsole/>
              </Route>
              <Route path = "/admin">
                <AdminLogin/>
              </Route>
              <Route path = "/store_managerConsole">
                  <StoreManagerConsole/>
              </Route>
              
            </Switch>
          </div>

        </ProductContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
