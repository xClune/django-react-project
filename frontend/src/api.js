// interceptor (using axios)
// intercept any request check for access and add.

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/djangoreactnotes/backend/rest-api-be2/v1.0"

const api = axios.create({
    baseURL: apiUrl ? apiUrl : import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

export default api