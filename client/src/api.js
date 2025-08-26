import axios from 'axios';

// In development, requests go to the CRA proxy (client/package.json proxy)
// In production, set REACT_APP_API_URL to your backend origin, e.g. https://api.example.com
const baseURL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_API_URL || '/api')
  : '/api';

const api = axios.create({ baseURL });

export default api;


