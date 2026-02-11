import axios from 'axios'

const api = axios.create({
    baseURL : '/api/v1/core',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

export default api;