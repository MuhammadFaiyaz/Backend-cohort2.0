import axios from "axios"

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true
})

export async function register({fullName, email, password, contactNumber, isSeller}) {
  const response = await authApiInstance.post("/register", { fullName, email, password, contactNumber, isSeller })
  return response.data
} 

export async function login({email, password}) {
  const response = await authApiInstance.post("/login", { email, password })
  return response.data
}