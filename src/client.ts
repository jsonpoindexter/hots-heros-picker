import axios from 'axios'

export const client = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 1000,
})
