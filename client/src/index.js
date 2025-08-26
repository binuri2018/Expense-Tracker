import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';

// Configure Axios base URL from environment for production deployments
const apiBaseUrl = process.env.REACT_APP_API_URL || '';
if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


