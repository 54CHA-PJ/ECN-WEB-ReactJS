import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar'; 
import Users from './Users';
import User from './User';
import UserBooks from './UserBooks';
import Borrow from './Borrow';
import Book from './Book';
import Books from './Books';
import Borrows from './Borrows';
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
    console.log("TOKEN:", token);
  }, [getToken]);

  const location = useLocation();
  const validPathNames = ["/home", "/users", "/user", "/books", "/book", "/borrows", "/borrow", "/userBooks"]
  const showNavbar = validPathNames.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/users" element={<Users/>} />
        <Route exact path="/user/:id" element={<User/>} />
        <Route exact path="/userBooks" element={<UserBooks/>} />
        <Route exact path="/books" element={<Books/>} />
        <Route exact path="/book/:id" element={<Book/>} />
        <Route exact path="/borrows" element={<Borrows/>} />
        <Route exact path="/borrow" element={<Borrow/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;