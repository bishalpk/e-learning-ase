// src/pages/quiz/QuizResult.jsx
import React, { useEffect, useState } from "react";
import { getQuizById, getResults } from "../../core/services/quizService";

export default function QuizResult({ params, location }) {
  const [resultEntry, setResultEntry] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    // Prefer result from navigation state (immediate after submit)
    if (location && location.state && location.state.resultEntry) {
      setResultEntry(location.state.resultEntry);
    } else {
      // fallback: find last result for this quiz from localStorage
      const all = getResults();
      const last = all.filter(r => Number(r.quizId) === Number(params.id))
                      .sort((a,b)=> b.date - a.date)[0];
      if (last) setResultEntry(last);
    }

    // load quiz meta
    getQuizById(params.id).then(setQuiz);
  }, [params.id, location]);

  if (!resultEntry) return <div style={{ padding: 20 }}>No results found for this quiz.</div>;

  const { result } = resultEntry;
  return (
    <div style={{ padding: 20 }}>
      <h1>Quiz Result: {quiz ? quiz.title : `#${params.id}`}</h1>

      <div style={{ marginBottom: 12 }}>
        <strong>Score:</strong> {result.obtained} / {result.totalPoints} ({result.percent.toFixed(1)}%)
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Passed:</strong> {result.passed ? "Yes" : "No"}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Taken at:</strong> {new Date(resultEntry.date).toLocaleString()}
      </div>

      <h3>Details</h3>
      <div>
        {result.details.map((d) => (
          <div key={d.questionId} style={{
            border: "1px solid #eee",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6
          }}>
            <div><strong>Question ID:</strong> {d.questionId}</div>
            <div><strong>Your answer:</strong> {Array.isArray(d.userAnswer) ? d.userAnswer.join(", ") : (typeof d.userAnswer === "undefined" ? "—" : String(d.userAnswer))}</div>
            <div><strong>Score:</strong> {d.questionScore} / {d.maxPoints}</div>
            <div><strong>Correct:</strong> {d.correct ? "Yes" : "No"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
