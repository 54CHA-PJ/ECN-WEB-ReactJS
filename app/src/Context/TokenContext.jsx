import React, { createContext, useState } from 'react';

export const TokenContext = createContext();

export function TokenProvider({ children }) {
  // sessionStorage : data is stored only for a session
  // localStorage : data is stored until it is cleared
  const [userToken, setUserToken] = useState(null);

  const setToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setUserToken(userToken);
  }
  const getToken = () => {
    return localStorage.getItem('token');
  }

  const removeToken = () => {
    localStorage.removeItem('token');
    setUserToken(null);
  }

  return (
    <TokenContext.Provider value={{ userToken, setToken, getToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
}