import { useEffect } from "react";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";
import "../style/feed.scss";
import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../user/components/Sidebar";

const Feed = () => {
  const { feed, loading, handleGetFeed } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading || !feed)
    return (
      <main>
        <h1>Feed is loading.....</h1>
      </main>
    );

  console.log(feed);

  return (
    <main>
      <Navbar />
      <div className="feed-container">
        <div className="left-panel">
          <Sidebar />
        </div>
        <div className="feed-content">
          <div className="posts">
            {feed.map((post) => (
              <Post key={post._id} user={post.user} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
