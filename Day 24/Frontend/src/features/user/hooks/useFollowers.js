import { useContext } from "react";
import { FollowContext } from "../context/Follow.context";

export const useFollowers = () => {
  const { followers, loading, error } = useContext(FollowContext);
  return { followers, loading, error };
};
