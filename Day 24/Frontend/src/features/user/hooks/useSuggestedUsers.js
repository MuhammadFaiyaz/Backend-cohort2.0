import { useContext } from "react";
import { FollowContext } from "../context/Follow.context";

export const useSuggestedUsers = () => {
  const { suggestedUsers, loading, error } = useContext(FollowContext);
  return { suggestedUsers, loading, error };
};
