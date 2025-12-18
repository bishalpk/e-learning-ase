import React from "react";

export default function ActivityPlayer({ url }) {
  return (
    <iframe
      src={url}
      width="100%"
      height="700px"
      allowFullScreen
      style={{
        border: "none",
        background: "#f0f0f0"
      }}
      title="Interactive Activity"
    ></iframe>
  );
}
