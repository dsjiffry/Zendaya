import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import TestPage from './Pages/TestPage';

import {initialState as userInitialState, UserContext , reducer as userReducer} from "./Contexts/UserStore"

function App() {

  const [state, dispatch] = React.useReducer(userReducer, userInitialState);
  

  return (
    <Router>
      <UserContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <div className="App">
          <Switch>
            <Route path="/test">
              {/* This page is for Testing Purposes Only */}
              <TestPage />
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
