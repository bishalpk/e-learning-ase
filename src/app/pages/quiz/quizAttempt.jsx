// src/pages/quiz/QuizAttempt.jsx
import React, { useEffect, useState, useRef } from "react";
import { getQuizById, evaluateAnswers, persistResult } from "../../core/services/quizService";

export default function QuizAttempt({ params, history }) {
  const { id } = params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    let mounted = true;
    getQuizById(id).then(q => {
      if (!mounted) return;
      setQuiz(q);
      setLoading(false);
      if (q && q.timeLimitSeconds) {
        setTimeLeft(q.timeLimitSeconds);
      }
    });
    return () => { mounted = false; clearInterval(timerRef.current); };
  }, [id]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      // auto submit
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [timeLeft]);

  if (loading) return <div style={{ padding: 20 }}>Loading quiz...</div>;
  if (!quiz) return <div style={{ padding: 20 }}>Quiz not found.</div>;

  const onChangeMCQ = (qid, optionId) => {
    setAnswers(prev => ({ ...prev, [qid]: optionId }));
  };

  const onChangeShort = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const evaluation = evaluateAnswers(quiz, answers);
      const stored = persistResult(null, quiz.id, evaluation);
      // redirect to result page with id of stored entry in query or simply push to /quiz/:id/result
      // We'll navigate to /quiz/:id/result and pass stored id via state
      history.push(`/quiz/${quiz.id}/result`, { resultEntry: stored, evaluation });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    if (s == null) return "";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{quiz.title}</h1>

      {timeLeft != null && (
        <div style={{ marginBottom: 10 }}>
          <strong>Time left:</strong> {formatTime(timeLeft)}
        </div>
      )}

      <div>
        {(quiz.questions || []).map((q, idx) => (
          <div key={q.id} style={{
            padding: 12, marginBottom: 10, border: "1px solid #eee", borderRadius: 4
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{idx + 1}. {q.text}</strong>
            </div>

            {q.type === "mcq" && (
              <div>
                {q.options.map(opt => (
                  <label key={opt.id} style={{ display: "block", marginBottom: 6 }}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt.id}
                      onChange={() => onChangeMCQ(q.id, opt.id)}
                      style={{ marginRight: 8 }}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            )}

            {q.type === "short" && (
              <div>
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => onChangeShort(q.id, e.target.value)}
                  placeholder="Type your answer..."
                  style={{ width: "100%", padding: 8 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
