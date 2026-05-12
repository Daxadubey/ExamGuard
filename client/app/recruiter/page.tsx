"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function RecruiterDashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Replace this with real examId later (or from params)
  const examId = "446eadc3-12ee-43ee-b749-8db1cffe4729";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          api.get(`/results/${examId}`),
          api.get(`/proctor/${examId}`),
        ]);

        setResults(res1.data.results);
        setLogs(res2.data.logs);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">

      {/* ================= RESULTS ================= */}
      <div>
        <h1 className="text-2xl font-bold mb-4">📊 Results</h1>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Candidate</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Passed</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="text-center">
                <td className="border p-2">{r.candidate.name}</td>
                <td className="border p-2">{r.score}</td>
                <td className="border p-2">
                  {r.passedCases}/{r.totalCases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PROCTOR LOGS ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">🚨 Proctoring Logs</h2>

        <div className="max-h-64 overflow-y-auto border p-3 bg-gray-50">
          {logs.length === 0 && <p>No logs yet</p>}

          {logs.map((log) => (
            <div
              key={log.id}
              className="text-sm border-b py-1 flex justify-between"
            >
              <span>
                👤 {log.candidateId} —{" "}
                <strong>{log.eventType}</strong>
              </span>
              <span className="text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}