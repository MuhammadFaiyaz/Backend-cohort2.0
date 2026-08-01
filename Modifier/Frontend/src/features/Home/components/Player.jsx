import React, { useEffect, useRef, useState } from "react";
import "../styles/Player.scss";
import { useSong } from "../hooks/useSong";

const Player = () => {
  const { song, loading } = useSong();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (value) => {
    if (!Number.isFinite(value) || value < 0) return "00:00";

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [song?.url]);

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback failed:", error);
    }
  };

  const skipTime = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds)
    );
  };

  const handleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  return (
    <section className="player-card">
      <audio
        ref={audioRef}
        src={song?.url}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className="player-card__header">
        <span className="player-card__pill">Now Playing</span>
        <h3 className="player-card__title">{song?.title || "No song selected"}</h3>
      </div>

      <div className="player-card__wave" aria-label="audio visualization">
        {[40, 70, 55, 90, 60, 85, 50].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </div>

      <div className="player-card__controls">
        <button
          className="player-card__control"
          aria-label="rewind"
          onClick={() => skipTime(-10)}
        >
          ◀◀
        </button>
        <button
          className="player-card__control player-card__control--play"
          aria-label="play or pause"
          onClick={togglePlayback}
        >
          {loading ? "…" : isPlaying ? "❚❚" : "▶"}
        </button>
        <button
          className="player-card__control"
          aria-label="forward"
          onClick={() => skipTime(10)}
        >
          ▶▶
        </button>
        <button
          className="player-card__control player-card__control--speed"
          aria-label="change playback speed"
          onClick={handleSpeed}
        >
          {speed}x
        </button>
      </div>

      <div className="player-card__meta">
        <div className="player-card__timeline" aria-hidden="true">
          <div className="player-card__progress" style={{ width: `${progressPercent}%` }} />
        </div>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </section>
  );
};

export default Player;
