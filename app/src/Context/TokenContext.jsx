import React, { createContext, useState } from 'react';

export const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [userToken, setUserToken] = useState(null);

  const setToken = (userToken) => {
    sessionStorage.setItem('token', userToken);
    setUserToken(userToken);
  }

  const getToken = () => {
    return sessionStorage.getItem('token');
  }

  const removeToken = () => {
    sessionStorage.removeItem('token');
    setUserToken(null);
  }

  return (
    <TokenContext.Provider value={{ userToken, setToken, getToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
}