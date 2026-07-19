import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef();

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    init({ videoRef, landmarkerRef, streamRef });

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px" }}
        playsInline
      />
      <h2>{expression}</h2>
      <button
        onClick={() => detect({ videoRef, landmarkerRef, setExpression })}
      >
        Detect expression
      </button>
    </div>
  );
}
