import axios from "axios"

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/auth",
  withCredentials: true
})

export async function register({fullName, email, password, contactNumber, isSeller}) {
  const response = await authApiInstance.post("/register", { fullName, email, password, contactNumber, isSeller })
  return response.data
} 