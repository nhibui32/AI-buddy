
const API_BASE_URL = "http://localhost:8000";

// CHAT
export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/tutor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message to AI Tutor");
  }

  const data = await response.json();
  return data.reply;
}

// QUIZ
export async function getQuestion() {
  const response = await fetch(`${API_BASE_URL}/api/quiz/random`);

  if (!response.ok) {
    throw new Error("Failed to load quiz question");
  }

  return await response.json();
}

export async function submitAnswer(questionId, choice) {
  const response = await fetch(`${API_BASE_URL}/api/quiz/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question_id: questionId,
      choice,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit your answer");
  }

  return await response.json();
}

export async function explainAnswer(questionId, choice) {
  const response = await fetch(`${API_BASE_URL}/api/tutor/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question_id: questionId,
      choice,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get explanation from AI Buddy");
  }

  return await response.json();
}

// LEARN
export async function getTopics() {
  const response = await fetch(`${API_BASE_URL}/api/learn/topics`);

  if (!response.ok) {
    throw new Error("Failed to load learning topics");
  }

  return await response.json();
}


export async function getTopic(slug, language = "en") {
  const response = await fetch(
    `${API_BASE_URL}/api/learn/${encodeURIComponent(slug)}?language=${language}`
  );

  if (!response.ok) {
    throw new Error("Failed to load topic content");
  }

  return await response.json();
}


// REVIEW
export async function getReviewQuestion() {
  const response = await fetch(`${API_BASE_URL}/api/review/next`);

  if (!response.ok) {
    throw new Error("Failed to load review question");
  }

  return await response.json();
}

// STATS
export async function getStats() {
  const response = await fetch(`${API_BASE_URL}/api/stats`);

  if (!response.ok) {
    throw new Error("Failed to load statistics");
  }

  return await response.json();
}
