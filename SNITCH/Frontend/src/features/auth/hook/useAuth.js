import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { register, login, getMe } from "../services/auth.api.js";
import { useDispatch } from "react-redux"

export const useAuth = () => {
  const dispatch = useDispatch()

  const handleRegister = async ({ fullName, email, password, contactNumber, isSeller=false }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await register({ fullName, email, password, contactNumber, isSeller })
      // localStorage.setItem("token", data.token)
      dispatch(setUser(data.user))
      return data.user
    } catch (err) {
      const validationErrors = err.response?.data?.errors
      const message = validationErrors?.map(({ msg }) => msg).join(" ")
        || err.response?.data?.message
        || err.message
      dispatch(setError(message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleLogin = async ({ email, password }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await login({ email, password })
      // localStorage.setItem("token", data.token)
      dispatch(setUser(data.user))
      return data.user
    } catch (err) {
      const validationErrors = err.response?.data?.errors
      const message = validationErrors?.map(({ msg }) => msg).join(" ")
        || err.response?.data?.message
        || err.message
      dispatch(setError(message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleGetMe = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await getMe()
      dispatch(setUser(data.user))
    } catch (err) {
      const validationErrors = err.response?.data?.errors
      const message = validationErrors?.map(({ msg }) => msg).join(" ")
        || err.response?.data?.message
        || err.message
      dispatch(setError(message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleRegister, handleLogin, handleGetMe }
}