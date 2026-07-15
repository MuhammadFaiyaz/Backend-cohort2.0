import { useContext } from "react";
import { FollowContext } from "../context/Follow.context";

export const useFollowings = () => {
  const { followings, loading, error } = useContext(FollowContext);
  return { followings, loading, error };
};
