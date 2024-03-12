import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// REMOVE STRICT MODE to evitate double rendering
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 