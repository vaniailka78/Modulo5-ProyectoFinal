import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_JS_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosInstance;
