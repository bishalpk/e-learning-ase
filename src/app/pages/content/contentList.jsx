import React, { useEffect, useState } from "react";
import { getContentList } from "../../core/services/contentService";
import ContentCard from "../../components/ContentCard";

export default function ContentList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getContentList().then(setList);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Learning Contents</h1>
      <div className="content-grid">
        {list.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
