import { Link } from "react-router";
import "./Home.scss";

const Home = () => {
  return (
    <section className="home">
      <div className="home__content">
        <h1 className="home__title">Welcome to MyApp</h1>
        <p className="home__subtitle">
          A simple starting point built with React, React Router, and SCSS.
        </p>

        <div className="home__actions">
          <Link to="/login" className="home__btn home__btn--primary">
            Login
          </Link>
          <Link to="/register" className="home__btn home__btn--secondary">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;