import React, {useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Users from './Users';
import Home from './Home';
import Navbar from './Navbar'; 
import NotFound from './NotFound';

function App() {
  const [userToken, setUserToken] = useState(null);

  const setToken = (userToken) => {
    sessionStorage.setItem('token', userToken);
    setUserToken(userToken);
  }

  const getToken = () => {
    const token = sessionStorage.getItem('token');
    setUserToken(token);
    return token;
  }

  const removeToken = () => {
    sessionStorage.removeItem('token');
    setUserToken(null);
  }

  useEffect(() => {
    getToken();
    console.log('Token:', userToken);
  }, [userToken]);

    return (
      <div className="App">
          <Router>
            <AppRoutes setToken={setToken} removeToken={removeToken} getToken={getToken}/>
          </Router>
      </div>
    );
  }
  
  function AppRoutes({ setToken, removeToken, getToken }) {
    const location = useLocation();
    const validPathNames = ["/home", "/users"];
    const showNavbar = validPathNames.includes(location.pathname); // Hide the Navbar component on the login and not-found pages
    return (
      <>
        {showNavbar && <Navbar />}
        <Routes>
          <Route exact path="/" element={<Login setToken={setToken} removeToken={removeToken} />} />
          <Route exact path="/home" element={<Home getToken={getToken} />} />
          <Route exact path="/users" element={<Users getToken={getToken} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

export default App;