import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Users from './Users';
import Home from './Home';
import Navbar from './Navbar'; 
import NotFound from './NotFound';
import { TokenProvider, TokenContext } from '../Context/TokenContext';

function App() {
  return (
    <TokenProvider>
      <div className="App">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </TokenProvider>
  );
}

function AppRoutes() {

  const { getToken } = useContext(TokenContext);

  useEffect(() => {
    const token = getToken();
    console.log("token", token);
  }, [getToken]);

  const location = useLocation();
  const validPathNames = ["/home", "/users"];
  const showNavbar = validPathNames.includes(location.pathname); // Hide the Navbar component on the login and not-found pages

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/users" element={<Users/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;