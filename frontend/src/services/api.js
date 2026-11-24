
const API_BASE_URL = "http://localhost:8000";

// Send a message to AI Tutor
export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/tutor/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message to AI Tutor");
  }

  const data = await response.json();

  return data.reply;
}

// Get a random quiz question
export async function getQuestion() {
  const response = await fetch(`${API_BASE_URL}/api/quiz/random`);

  if (!response.ok) {
    throw new Error("Failed to load quiz question");
  }

  return await response.json();
}

// Submit an answer
export async function submitAnswer(questionId, choice) {
  const response = await fetch(`${API_BASE_URL}/api/quiz/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: questionId,
      choice: choice,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit your answer");
  }

  return await response.json();
}

// Ask AI Buddy to explain a question
export async function explainAnswer(questionId, choice) {
  const response = await fetch(`${API_BASE_URL}/api/tutor/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: questionId,
      choice: choice,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get explanation from AI Buddy");
  }

  return await response.json();
}
