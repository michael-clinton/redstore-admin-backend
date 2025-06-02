import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000', // Base URL for all requests
});

export default axiosInstance;
