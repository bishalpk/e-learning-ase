import React, { useEffect, useState } from "react";
import { getContentById } from "../../core/services/contentService";
import PdfViewer from "./pdfViewer";
import VideoPlayer from "./videoPlayer";
import ActivityPlayer from "./activityPlayer";

export default function ContentDetails({ params }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getContentById(params.id).then(setContent);
  }, [params.id]);

  if (!content) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{content.title}</h1>

      {content.type === "pdf" && <PdfViewer url={content.url} />}
      {content.type === "video" && <VideoPlayer url={content.url} />}
      {content.type === "activity" && <ActivityPlayer url={content.url} />}
    </div>
  );
}
