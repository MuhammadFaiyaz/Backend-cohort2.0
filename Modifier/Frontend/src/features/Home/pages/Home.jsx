import { Link } from "react-router";
import "../styles/Home.scss";
import FaceExpression from "../../expression/components/FaceExpression.jsx";
import Player from "../components/Player.jsx";
import { useSong } from "../hooks/useSong.js";

const Home = () => {

  const {handleGetSong} = useSong()

  return (
    <>
      <FaceExpression onClick={(expression)=> handleGetSong({mood: expression})} />
      <Player />
    </>
  );
};

export default Home;
