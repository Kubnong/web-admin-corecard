import axios from 'axios'

const apiEndpoint = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL : apiEndpoint,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

export default api;