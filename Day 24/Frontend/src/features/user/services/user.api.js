import axios from "axios";

const createApi = (baseURL)=>axios.create({
  baseURL,
  withCredentials: true,
});
const api = createApi(import.meta.env.VITE_API_URL)
const api2 = createApi(import.meta.env.VITE_API_URL_2)


const request = async (client, method, url) => {
  try {
    const {data} = await client[method](url);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFollowers = () => request(api, "get", "/followers");
export const getFollowings = () => request(api, "get","/following");
export const getSuggestedUsers = () => request(api, "get","/suggested");

export const followUser = (username) => request(api2, "post", `/follow/${username}`)
export const unfollowUser =  (username) => request(api2, "post", `/unfollow/${username}`)