import { useContext, createContext, useState } from "react";

export const SongContext = createContext();
export const SongProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState({
    _id: {
      $oid: "6a6acdcbd8a0f5304bf414d5",
    },
    url: "https://ik.imagekit.io/muhammadfaiyaz/cohort-2/moodify/songs/Dhop__From__Game_Changer____Hindi__KDSQ6lwP6.mp3",
    posterUrl:
      "https://ik.imagekit.io/muhammadfaiyaz/cohort-2/moodify/posters/Dhop__From__Game_Changer____Hindi__-fhbKO3qQ.jpeg",
    title: 'Dhop (From "Game Changer") (Hindi)',
    mood: "surprised",
    __v: 0,
  });

  return(
    <SongContext.Provider value={{loading, setLoading, song, setSong}}>
        {children}
    </SongContext.Provider>
  )
};
