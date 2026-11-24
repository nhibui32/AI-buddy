
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getTopics, getTopic } from "../services/api";
import "./Learn.css";

function Learn() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      setLoading(true);
      setError("");

      const data = await getTopics();
      setTopics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectTopic(slug) {
    try {
      setLoading(true);
      setError("");

      const data = await getTopic(slug, language);
      setSelectedTopic(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLanguageChange(newLanguage) {
    if (!selectedTopic || newLanguage === language) return;

    try {
      setLoading(true);
      setError("");

      const data = await getTopic(selectedTopic.slug, newLanguage);

      setSelectedTopic(data);
      setLanguage(newLanguage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatTitle(topic) {
    if (topic.title) return topic.title;

    return topic.slug
      .split("_")
      .join(" ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="learn-h1">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="learn-h2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="learn-h3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="learn-paragraph">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="learn-bold">{children}</strong>
    ),
    ul: ({ children }) => (
      <ul className="learn-list">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="learn-list-item">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="learn-tip">{children}</blockquote>
    ),
  };

  return (
    <div className="learn-container">

      {error && (
        <div className="learn-error">
          {error}
        </div>
      )}

      {selectedTopic ? (
        <div className="learn-reading">

          <button
            className="learn-back"
            onClick={() => setSelectedTopic(null)}
          >
            ← Back to topics
          </button>

          <div className="learn-article">

            <div className="learn-article-header">
              <span className="learn-label">
                SECURITY+ STUDY NOTES
              </span>

              <h1>{selectedTopic.title}</h1>

              <p>
                Review the key concepts and prepare for your exam.
              </p>

              <div className="learn-language-switch">
                <button
                  className={language === "en" ? "active" : ""}
                  onClick={() => handleLanguageChange("en")}
                  disabled={loading}
                >
                  EN
                </button>

                <button
                  className={language === "vi" ? "active" : ""}
                  onClick={() => handleLanguageChange("vi")}
                  disabled={loading}
                >
                  VI
                </button>
              </div>
            </div>

            <div className="learn-content">
              {loading ? (
                <p>Loading notes...</p>
              ) : (
                <ReactMarkdown components={markdownComponents}>
                  {selectedTopic.content}
                </ReactMarkdown>
              )}
            </div>

            <div className="learn-footer">
              <p>End of study notes</p>

              <button
                onClick={() => setSelectedTopic(null)}
              >
                Back to all topics ↑
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div>
          <div className="learn-heading">
            <span className="learn-label">YOUR STUDY SPACE</span>

            <h2>Learn Security+</h2>

            <p>
              Choose a topic to explore your study notes.
            </p>
          </div>

          {loading ? (
            <p className="learn-loading">Loading topics...</p>
          ) : (
            <div className="learn-topic-grid">
              {topics.map((topic, index) => (
                <button
                  key={topic.slug}
                  onClick={() => handleSelectTopic(topic.slug)}
                  className="learn-topic-card"
                >
                  <div className="learn-topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="learn-topic-info">
                    <h3>{formatTitle(topic)}</h3>
                    <p>Open study notes and learn more</p>
                  </div>

                  <span className="learn-topic-arrow">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Learn;
