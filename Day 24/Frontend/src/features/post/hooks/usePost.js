import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";
import { getFeed, createPost, likePost, unlikePost } from "../services/post.api";

export const usePost = () => {
  const context = useContext(PostContext);
  const { post, setPost, feed, setFeed, loading, setLoading } = context;
  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    try {
      const data = await createPost(imageFile, caption);
      setFeed([data.post, ...feed]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLikePost = async (post) => {
    setLoading(true);
    const data = await likePost(post)
    await handleGetFeed()
    setLoading(false)
  }
  const handleUnlikePost = async (post) => {
    setLoading(true);
    const data = await unlikePost(post)
    await handleGetFeed()
    setLoading(false)
  }

  return { loading, feed, handleGetFeed, handleCreatePost, post, handleLikePost, handleUnlikePost };
};
