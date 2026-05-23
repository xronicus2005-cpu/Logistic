import axios from "axios"

const api = axios.create({
    baseURL: "https://logistic-r0lo.onrender.com/api",
    withCredentials: true
})

export default api
