
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  getQuestion,
  submitAnswer,
  explainAnswer,
} from "../services/api";

function Quiz() {
  const [question, setQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [result, setResult] = useState(null);
  const [buddyReply, setBuddyReply] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [askingBuddy, setAskingBuddy] = useState(false);
  const [error, setError] = useState("");

  // Load the first question when Quiz opens
  useEffect(() => {
    loadQuestion();
  }, []);

  // Get a new random question
  async function loadQuestion() {
    setLoading(true);
    setError("");
    setQuestion(null);
    setSelectedChoice("");
    setResult(null);
    setBuddyReply("");

    try {
      const data = await getQuestion();
      setQuestion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Submit the selected answer
  async function handleChoose(choice) {
    if (!question || result || submitting) return;

    setSelectedChoice(choice);
    setSubmitting(true);
    setError("");

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

  // Ask AI Buddy for a deeper explanation
  async function handleAskBuddy() {
    if (!question || !selectedChoice) return;

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
        Loading question...
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="h-[450px] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadQuestion}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-[450px] p-6">

      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Security+ Practice Quiz
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Topic: {question.topic}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          Practice
        </span>
      </div>

      {/* Question */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {question.question}
        </h3>
      </div>

      {/* Answer Choices */}
      <div className="space-y-3">
        {Object.entries(question.choices).map(([letter, text]) => {
          const isSelected = selectedChoice === letter;
          const isCorrect =
            result && result.correct_answer === letter;

          let buttonStyle =
            "border-gray-200 hover:border-blue-500 hover:bg-blue-50";

          if (result && isCorrect) {
            buttonStyle = "border-green-500 bg-green-50 text-green-800";
          } else if (result && isSelected && !result.correct) {
            buttonStyle = "border-red-500 bg-red-50 text-red-800";
          } else if (isSelected) {
            buttonStyle = "border-blue-500 bg-blue-50";
          }

          return (
            <button
              key={letter}
              onClick={() => handleChoose(letter)}
              disabled={!!result || submitting}
              className={`w-full text-left border-2 rounded-xl p-4 transition ${buttonStyle} disabled:cursor-not-allowed`}
            >
              <span className="font-bold mr-3">
                {letter}.
              </span>

              {text}
            </button>
          );
        })}
      </div>

      {/* Answer Result */}
      {result && (
        <div
          className={`mt-6 p-5 rounded-xl ${
            result.correct
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <h3
            className={`text-lg font-bold ${
              result.correct ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.correct ? "Correct! 🎉" : "Incorrect. Keep learning!"}
          </h3>

          <p className="mt-2 text-gray-700">
            Correct answer:{" "}
            <strong>{result.correct_answer}</strong>
          </p>

          <p className="mt-3 text-gray-700">
            {result.explanation}
          </p>
        </div>
      )}

      {/* Ask Buddy Result */}
      {buddyReply && (
        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-700 mb-3">
            🤖 Cyber Buddy explains
          </h3>

          <div className="text-gray-800">
            <ReactMarkdown>
              {buddyReply}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && question && (
        <p className="mt-4 text-red-500 text-sm">
          {error}
        </p>
      )}

      {/* Action Buttons */}
      {result && (
        <div className="flex flex-wrap gap-3 mt-6">

          <button
            onClick={handleAskBuddy}
            disabled={askingBuddy}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {askingBuddy ? "Buddy is thinking..." : "Ask Buddy 🤖"}
          </button>

          <button
            onClick={loadQuestion}
            className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-900"
          >
            Next Question →
          </button>

        </div>
      )}

      {submitting && (
        <p className="text-center text-gray-500 mt-4">
          Checking your answer...
        </p>
      )}

    </div>
  );
}

export default Quiz;
