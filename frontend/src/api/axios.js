import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://redstore-ecommerce-platform.onrender.com`, 
});

export default axiosInstance;
