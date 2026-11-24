// function App() {
//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
//         <h1 className="text-3xl font-bold text-blue-600">
//           Nhi's Cyber Buddy
//         </h1>

//         <p className="mt-3 text-gray-600">
//           Your AI Cybersecurity Learning Companion
//         </p>

//         <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//           Start Learning
//         </button>
//       </div>
//     </div>
//   )
// }

// export default App


import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "./services/api";
import Quiz from "./components/Quiz";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Remember which tab is currently selected
  const [activeTab, setActiveTab] = useState("Chat");

  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Send a message to AI Tutor
  async function handleSend(e) {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            Nhi's Cyber Buddy
          </h1>

          <p className="text-blue-100 mt-1">
            Your AI Cybersecurity Learning Companion
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex border-b">
          {["Chat", "Quiz", "Learn", "Review"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-medium transition ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Chat Page */}
        {activeTab === "Chat" && (
          <>
            {/* Chat Messages */}
            <div className="h-[450px] overflow-y-auto p-6 space-y-4">

              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-24">
                  <h2 className="text-xl font-semibold">
                    Hello! 👋
                  </h2>

                  <p className="mt-2">
                    Ask me anything about cybersecurity!
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        strong: ({ children }) => (
                          <strong className="font-bold text-gray-900">
                            {children}
                          </strong>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 mb-2 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li>{children}</li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mb-2">
                            {children}
                          </h2>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-200 px-1 rounded text-sm">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-gray-500 text-sm">
                  Cyber Buddy is thinking...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSend}
              className="border-t p-4 flex gap-3"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a cybersecurity question..."
                className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        )}

        {/* Quiz Page */}
        {activeTab === "Quiz" && <Quiz />}

        {/* Learn Page */}
        {activeTab === "Learn" && (
          <div className="h-[450px] flex flex-col items-center justify-center text-gray-500">
            <h2 className="text-2xl font-bold">Learn</h2>
            <p className="mt-2">Learning materials coming soon!</p>
          </div>
        )}

        {/* Review Page */}
        {activeTab === "Review" && (
          <div className="h-[450px] flex flex-col items-center justify-center text-gray-500">
            <h2 className="text-2xl font-bold">Review</h2>
            <p className="mt-2">Review system coming soon!</p>
          </div>
        )}

              </div>
            </div>
          );
        }

export default App;
