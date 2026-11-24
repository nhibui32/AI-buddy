
import { useEffect, useState } from "react";
import { getStats } from "../services/api";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-[450px] flex items-center justify-center text-gray-500">
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[450px] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={loadStats}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const accuracy = Math.round(stats.accuracy * 100);

  return (
    <div className="min-h-[450px] p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Learning Statistics
          </h2>

          <p className="text-gray-500 mt-1">
            Track your Security+ learning progress.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Refresh ↻
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">

        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Total Attempts
          </p>

          <h3 className="text-2xl font-bold text-blue-700 mt-2">
            {stats.total}
          </h3>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Correct
          </p>

          <h3 className="text-2xl font-bold text-green-700 mt-2">
            {stats.correct}
          </h3>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Accuracy
          </p>

          <h3 className="text-2xl font-bold text-purple-700 mt-2">
            {accuracy}%
          </h3>
        </div>

      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-gray-800">
            Overall Accuracy
          </h3>

          <span className="font-bold text-blue-600">
            {accuracy}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* Topic Statistics */}
      <h3 className="font-semibold text-gray-800 mb-3">
        Performance by Topic
      </h3>

      {stats.by_topic.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No quiz attempts yet. Start practicing to see your progress!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3 rounded-l-lg">Topic</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Correct</th>
                <th className="p-3 rounded-r-lg">Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {stats.by_topic.map((item) => {
                const topicAccuracy = Math.round(
                  (item.correct / item.attempts) * 100
                );

                return (
                  <tr key={item.topic} className="border-b">
                    <td className="p-3 font-medium text-gray-800">
                      {item.topic}
                    </td>

                    <td className="p-3 text-gray-600">
                      {item.attempts}
                    </td>

                    <td className="p-3 text-green-700">
                      {item.correct}
                    </td>

                    <td className="p-3 font-semibold text-blue-600">
                      {topicAccuracy}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Stats;
