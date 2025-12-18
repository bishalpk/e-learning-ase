// src/components/QuizCard.jsx
import React from "react";
import { Link } from "react-router";

export default function QuizCard({ quiz }) {
  return (
    <div className="quiz-card" style={{
      border: "1px solid #ddd",
      padding: 16,
      borderRadius: 6,
      marginBottom: 12,
      background: "#fff"
    }}>
      <h3 style={{ marginTop: 0 }}>{quiz.title}</h3>
      <p>Questions: {quiz.questions ? quiz.questions.length : 0}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Link to={`/quiz/${quiz.id}`}><button>Attempt</button></Link>
        <Link to={`/quiz/${quiz.id}/result`}><button>View last result</button></Link>
      </div>
    </div>
  );
}
