import React from "react";

export default function PdfViewer({ url }) {
  return (
    <iframe
      src={url}
      width="100%"
      height="600px"
      style={{ border: "none" }}
      title="PDF Viewer"
    ></iframe>
  );
}
