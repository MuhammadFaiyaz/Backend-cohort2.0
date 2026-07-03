import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});
export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post(
      "/login",
      {
        username,
        password,
      },
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
