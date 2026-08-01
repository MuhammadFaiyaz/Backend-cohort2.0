import { useContext } from "react"
import { AuthContext } from "../auth.context"
import { getMe, login, logout, register } from "../services/auth.api"


export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        const data = await register({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }
    async function handleLogin({ username, email, password }) {
        setLoading(true)
        const data = await login({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }
    async function handleGetMe() {
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }
    async function handleLogout() {
        setLoading(true)
        const data = await logout()
        setUser(null)
        setLoading(false)
    }

    return ({
        user, loading, handleGetMe, handleLogin, handleRegister, handleLogout
    })
}