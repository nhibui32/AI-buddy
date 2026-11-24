
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  getReviewQuestion,
  submitAnswer,
  explainAnswer,
} from "../services/api";

function Review() {
  const [question, setQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [result, setResult] = useState(null);
  const [buddyReply, setBuddyReply] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [askingBuddy, setAskingBuddy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviewQuestion();
  }, []);

  async function loadReviewQuestion() {
    setLoading(true);
    setError("");
    setQuestion(null);
    setSelectedChoice("");
    setResult(null);
    setBuddyReply("");
    setFinished(false);

    try {
      const data = await getReviewQuestion();

      if (data.message) {
        setFinished(true);
      } else {
        setQuestion(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChoose(choice) {
    if (!question || result || submitting) return;

    setSelectedChoice(choice);
    setSubmitting(true);

    try {
      const data = await submitAnswer(question.id, choice);
      setResult(data);
    } catch (err) {
      setError(err.message);
      setSelectedChoice("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAskBuddy() {
    setAskingBuddy(true);
    setError("");

    try {
      const data = await explainAnswer(
        question.id,
        selectedChoice
      );

      setBuddyReply(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setAskingBuddy(false);
    }
  }

  if (loading) {
    return (
      <div className="h-[450px] flex items-center justify-center text-gray-500">
        Loading review question...
      </div>
    );
  }

  if (error && !question && !finished) {
    return (
      <div className="h-[450px] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadReviewQuestion}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="h-[450px] flex flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">🎉</div>

        <h2 className="text-2xl font-bold text-green-600">
          Nice work!
        </h2>

        <p className="text-gray-500 mt-2">
          You have no mistakes to review. Keep it up!
        </p>

        <button
          onClick={loadReviewQuestion}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Check Again
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-[450px] p-6">

      <h2 className="text-2xl font-bold text-gray-800">
        Review Your Mistakes
      </h2>

      <p className="text-gray-500 mt-1 mb-6">
        Practice questions you answered incorrectly.
      </p>

      <div className="bg-gray-50 rounded-xl p-5 mb-5">
        <p className="text-sm text-blue-600 font-medium mb-2">
          {question.topic}
        </p>

        <h3 className="text-lg font-semibold text-gray-800">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {Object.entries(question.choices).map(([letter, text]) => {
          const isSelected = selectedChoice === letter;
          const isCorrect =
            result && result.correct_answer === letter;

          let style =
            "border-gray-200 hover:border-blue-500 hover:bg-blue-50";

          if (result && isCorrect) {
            style = "border-green-500 bg-green-50 text-green-800";
          } else if (result && isSelected && !result.correct) {
            style = "border-red-500 bg-red-50 text-red-800";
          }

          return (
            <button
              key={letter}
              onClick={() => handleChoose(letter)}
              disabled={!!result || submitting}
              className={`w-full text-left border-2 rounded-xl p-4 transition ${style}`}
            >
              <strong className="mr-3">{letter}.</strong>
              {text}
            </button>
          );
        })}
      </div>

      {result && (
        <div className={`mt-6 p-5 rounded-xl ${
          result.correct
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}>
          <h3 className="font-bold text-lg">
            {result.correct
              ? "Correct! 🎉"
              : "Incorrect. Keep practicing!"}
          </h3>

          <p className="mt-2">
            Correct answer: <strong>{result.correct_answer}</strong>
          </p>

          <p className="mt-3">{result.explanation}</p>
        </div>
      )}

      {buddyReply && (
        <div className="mt-5 p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-700 mb-3">
            🤖 Cyber Buddy explains
          </h3>

          <ReactMarkdown>{buddyReply}</ReactMarkdown>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {result && (
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleAskBuddy}
            disabled={askingBuddy}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {askingBuddy ? "Buddy is thinking..." : "Ask Buddy 🤖"}
          </button>

          <button
            onClick={loadReviewQuestion}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl"
          >
            Next Review →
          </button>
        </div>
      )}

      {submitting && (
        <p className="text-gray-500 text-sm mt-4">
          Checking your answer...
        </p>
      )}
    </div>
  );
}

export default Review;
