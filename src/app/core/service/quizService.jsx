// src/core/services/quizService.js
// Client-side dummy quiz data + evaluation + persistence

const QUIZ_STORAGE_KEY = "quiz_results_v1";

export const quizList = [
  {
    id: 1,
    title: "Basic Math Quiz",
    contentId: 1,
    timeLimitSeconds: 600, // optional timer
    questions: [
      {
        id: "q1",
        type: "mcq",
        text: "What is 2 + 2?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "22" }
        ],
        correct: ["b"],
        points: 1
      },
      {
        id: "q2",
        type: "mcq",
        text: "Select the prime number.",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "9" },
          { id: "c", text: "11" },
          { id: "d", text: "15" }
        ],
        correct: ["c"],
        points: 1
      },
      {
        id: "q3",
        type: "short",
        text: "Write the capital of France.",
        correctText: ["paris"],
        points: 1
      }
    ]
  },
  {
    id: 2,
    title: "Intro Science",
    contentId: 2,
    timeLimitSeconds: 900,
    questions: [
      {
        id: "s1",
        type: "mcq",
        text: "Water boils at which temperature (°C) at sea level?",
        options: [
          { id: "a", text: "90" },
          { id: "b", text: "95" },
          { id: "c", text: "100" },
          { id: "d", text: "110" }
        ],
        correct: ["c"],
        points: 2
      }
    ]
  }
];

export const getQuizList = async () => {
  // simulate async
  return new Promise((res) => setTimeout(() => res(quizList), 150));
};

export const getQuizById = async (id) => {
  const quiz = quizList.find((q) => Number(q.id) === Number(id));
  return new Promise((res) => setTimeout(() => res(quiz || null), 120));
};

export const evaluateAnswers = (quiz, answers) => {
  // answers: { questionId: answer } where answer is:
  // - for mcq: single option id (string) or array for multi
  // - for short: string
  let totalPoints = 0;
  let obtained = 0;
  const details = [];

  (quiz.questions || []).forEach((q) => {
    totalPoints += q.points || 1;
    const userAns = answers[q.id];

    let questionScore = 0;
    let correct = false;
    if (q.type === "mcq") {
      // single answer expected
      const ans = Array.isArray(userAns) ? userAns : [userAns];
      const expected = q.correct || [];
      // simple exact match check for single-answer MCQ
      if (expected.length === 1 && ans[0]) {
        if (expected.includes(ans[0])) {
          questionScore = q.points || 1;
          correct = true;
        }
      } else {
        // multi correct - compare sets
        const a = new Set((ans || []).filter(Boolean));
        const b = new Set(expected);
        if (a.size === b.size && [...a].every((x) => b.has(x))) {
          questionScore = q.points || 1;
          correct = true;
        }
      }
    } else if (q.type === "short") {
      if (typeof userAns === "string") {
        const clean = userAns.trim().toLowerCase();
        const matchList = (q.correctText || []).map((t) => t.trim().toLowerCase());
        if (matchList.includes(clean)) {
          questionScore = q.points || 1;
          correct = true;
        } else {
          // rudimentary partial credit: startsWith first word match
          const first = clean.split(" ")[0];
          if (matchList.some((m) => m.split(" ")[0] === first)) {
            questionScore = (q.points || 1) * 0.5;
          }
        }
      }
    } else {
      // other types - no scoring by default
    }

    obtained += questionScore;
    details.push({
      questionId: q.id,
      correct,
      questionScore,
      maxPoints: q.points || 1,
      userAnswer: userAns
    });
  });

  const percent = totalPoints === 0 ? 0 : (obtained / totalPoints) * 100;
  return {
    totalPoints,
    obtained,
    percent,
    passed: percent >= 50, // default passing threshold
    details
  };
};

export const persistResult = (userId, quizId, result) => {
  // userId optional in client-only mode; we'll store by quizId + timestamp
  const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : [];
  const entry = {
    id: `${quizId}_${Date.now()}`,
    quizId,
    userId: userId || null,
    date: Date.now(),
    result
  };
  data.push(entry);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  return entry;
};

export const getResults = () => {
  const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};
