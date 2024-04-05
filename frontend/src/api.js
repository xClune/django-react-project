// interceptor (using axios)
// intercept any request check for access and add.

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "https://2e36e3a5-118c-4550-8c9f-4d04e4ad3d3f-dev.e1-us-cdp-2.choreoapis.dev/djangoreactnotes/backend/rest-api-be2/v1.0"

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