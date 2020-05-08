import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import TestPage from './Pages/TestPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/test">
              {/* This page is for Testing Purposes Only */}
              <TestPage/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
