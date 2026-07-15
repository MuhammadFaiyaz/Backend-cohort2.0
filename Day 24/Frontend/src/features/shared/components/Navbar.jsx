import { useNavigate } from "react-router-dom";
import "../nav.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
        <p className="logo">Insta</p>
        <button
          onClick={() => {
            navigate("/create-post");
            console.log(123)
          }}
          className="btn primary-btn"
        >
          New Post
        </button>
      </nav>
    </>
  );
};

export default Navbar;
