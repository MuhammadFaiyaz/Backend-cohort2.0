import { useState, useRef } from "react";
import "../style/createPost.scss";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageFileRef = useRef(null);
  const { loading, handleCreatePost } = usePost();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = postImageFileRef.current.files[0];

    await handleCreatePost(file, caption);
    navigate("/feed");
  };

  if (loading)
    return (
      <main>
        <h1>Creating post...</h1>
      </main>
    );

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit} className="create-post__card">
        <h2 className="create-post__title">Create New Post</h2>

        <div className="create-post__group">
          <label htmlFor="imageFile" className="create-post__label">
            Image
          </label>
          <input
            ref={postImageFileRef}
            type="file"
            id="imageFile"
            className="create-post__file"
          />
        </div>

        <div className="create-post__group">
          <label className="create-post__label">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            className="create-post__textarea"
            placeholder="Write a caption..."
            rows="5"
          ></textarea>
        </div>

        <button className="btn primary-btn create-post__submit">
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
