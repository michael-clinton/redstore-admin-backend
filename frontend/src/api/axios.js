import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://redstore-admin-backend.onrender.com`, 
});

export default axiosInstance;




