import axios from 'axios'

//URL da API
export const api = axios.create({
    baseURL:"https://localhost:7297"
})