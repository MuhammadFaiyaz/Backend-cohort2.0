import { useContext } from "react";
import { AuthContext } from "../Auth.context";
import { login, register, getMe } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const data = await login(username, password);
      setUser(data.user);
    } catch (err) {
      console.error("Error logging in:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await register(username, email, password);
      setUser(data.user);
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
  };
};
