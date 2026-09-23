import { setUser, setLoading, setError } from "../state/auth.slice";
import { register } from "../services/auth.api";
import { useDispatch } from "react-redux"

export const uesAuth = () => {
  const dispatch = useDispatch()

  const handleRegister = async ({ fullName, email, password, contactNumber, isSeller=false }) => {
    dispatch(setLoading(true))
    try {
      const data = await register({ fullName, email, password, contactNumber, isSeller })
      // localStorage.setItem("token", data.token)
      dispatch(setUser(data.user))
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleRegister }
}