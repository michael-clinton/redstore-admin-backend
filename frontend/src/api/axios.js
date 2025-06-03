import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://redstore-ecommerce-platform.onrender.com', // Base URL for all requests
});

export default axiosInstance;
