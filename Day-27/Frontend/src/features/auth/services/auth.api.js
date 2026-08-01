import axios from 'axios';


const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function register({username, email, password}) {
    const response = await api.post("/register", {username, email, password});
    return response.data
}
export async function login({username, email, password}) {
    const response = await api.post("/login", {username, email, password});
    return response.data
}
export async function getMe({username, email, password}) {
    const response = await api.get("/get-me");
    return response.data
}
export async function logout({username, email, password}) {
    const response = await api.post("/logout");
    return response.data
}