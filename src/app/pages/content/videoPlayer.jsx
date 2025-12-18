import React from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer({ url }) {
  return (
    <div style={{ maxWidth: "800px", marginTop: 20 }}>
      <ReactPlayer width="100%" height="450px" controls url={url} />
    </div>
  );
}
