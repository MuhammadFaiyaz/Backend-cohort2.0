import { setUser, setLoading, setError } from "../state/auth.slice";
import { register } from "../services/auth.api";
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

  return { handleRegister, handleLogin }
}