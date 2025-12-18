// src/pages/quiz/QuizList.jsx
import React, { useEffect, useState } from "react";
import { getQuizList } from "../../core/services/quizService";
import QuizCard from "../../components/QuizCard";

export default function QuizList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getQuizList().then(setList);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Quizzes</h1>
      <div>
        {list.map(q => <QuizCard key={q.id} quiz={q} />)}
      </div>
    </div>
  );
}
    