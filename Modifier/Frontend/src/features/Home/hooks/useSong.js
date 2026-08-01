import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSong } from "../services/song.api";

export function useSong() {
    const { loading, setLoading, song, setSong } = useContext(SongContext);

    async function handleGetSong({ mood }) {
        if (!mood) return;

        setLoading(true);
        const data = await getSong({ mood });
        setSong(data.song);
        setLoading(false);
    }

    return ({ loading, song, handleGetSong })
}