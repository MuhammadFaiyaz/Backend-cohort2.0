import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  followUser,
  getFollowers,
  getFollowings,
  getSuggestedUsers,
  unfollowUser,
} from "../services/user.api";
import { useAuth } from "../../auth/hooks/useAuth";

export const FollowContext = createContext();
export const FollowProvider = ({ children }) => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshFollowData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [followersResponse, followingsResponse, suggestedResponse] =
        await Promise.all([
          getFollowers(),
          getFollowings(),
          getSuggestedUsers(),
        ]);
console.log(followingsResponse);
      setFollowers(followersResponse?.followers || []);
      setFollowings(followingsResponse?.followings || []);
      console.log(followings);
      setSuggestedUsers(suggestedResponse?.suggestedUsers || []);
    } catch (err) {
      setError(err?.message || "Failed to load follow data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
      console.log("Current user:", user);

    if (user) {
      console.log("Fetching follow data...");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshFollowData();
    }
  }, [user, refreshFollowData]);

  const toggleFollow = useCallback(
    async (username) => {
      setLoading(true);
      setError(null);
      const isFollowing = followings.some((user) => user.username === username);

      try {
        if (isFollowing) {
          await unfollowUser(username);
          setFollowings((prev) =>
            prev.filter((user) => user.username !== username),
          );
          const removedUser = followings.find(
            (user) => user.username === username,
          );
          if (removedUser) setSuggestedUsers((prev) => [...prev, removedUser]);
        } else {
          await followUser(username);
          const userToFollow = suggestedUsers.find(
            (user) => user.username === username,
          );

          if (userToFollow) {
            setFollowings((prev) => [...prev, userToFollow]);
            setSuggestedUsers((prev) =>
              prev.filter((user) => user.username !== username),
            );
          }
        }
      } catch (err) {
        setError(err?.message || "Follow action failed");
      } finally {
        setLoading(false);
      }
    },
    [followings, suggestedUsers],
  );
  const value = useMemo(
    () => ({
      followers,
      followings,
      suggestedUsers,
      loading,
      error,
      refreshFollowData,
      toggleFollow,
    }),
    [
      followers,
      followings,
      suggestedUsers,
      loading,
      error,
      toggleFollow,
      refreshFollowData,
    ],
  );

  return (
    <FollowContext.Provider value={value}>{children}</FollowContext.Provider>
  );
};
