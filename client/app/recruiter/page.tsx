"use client";

import axios from "axios";
import { type FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type ResultRow = {
  id: string;
  score: number;
  passedCases: number;
  totalCases: number;
  candidate: { name: string };
};

type ProctorLog = {
  id: string;
  candidateId: string;
  eventType: string;
  timestamp: string;
};

export default function RecruiterDashboard() {
  const [sessionUser, setSessionUser] = useState<User | null | undefined>(
    undefined,
  );
  const [results, setResults] = useState<ResultRow[]>([]);
  const [logs, setLogs] = useState<ProctorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const examId = "446eadc3-12ee-43ee-b749-8db1cffe4729";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get<{ user: User }>("/auth/me");
        setSessionUser(data.user);
      } catch {
        setSessionUser(null);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (sessionUser?.role !== "RECRUITER") return;

    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [res1, res2] = await Promise.all([
          api.get<{ results: ResultRow[] }>(`/results/${examId}`),
          api.get<{ logs: ProctorLog[] }>(`/proctor/${examId}`),
        ]);

        setResults(res1.data.results ?? []);
        setLogs(res2.data.logs ?? []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const msg = err.response?.data as { message?: string } | undefined;
          setFetchError(
            msg?.message ??
              (status === 401
                ? "Not authenticated. Log in again."
                : status === 403
                  ? "Access denied. This account must be a recruiter."
                  : status === 404
                    ? "Exam or API route not found. Check exam ID and that the server is running."
                    : `Request failed (${status ?? "network"}).`),
          );
        } else {
          setFetchError("Could not load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionUser, examId]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const { data } = await api.post<{ user: User }>("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      setSessionUser(data.user);
    } catch {
      setLoginError("Invalid email or password.");
    }
  };

  if (sessionUser === undefined) {
    return <div className="p-4">Checking session...</div>;
  }

  if (sessionUser === null) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold">Recruiter login</h1>
        <p className="text-sm text-slate-600">
          Results and proctor logs require a recruiter account. Use the same API
          as <code className="rounded bg-slate-100 px-1">POST /api/v1/auth/login</code>.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          {loginError && (
            <p className="text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-slate-900 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  if (sessionUser.role !== "RECRUITER") {
    return (
      <div className="p-6">
        <p className="font-medium">Access denied.</p>
        <p className="mt-2 text-sm text-slate-600">
          This page is only for users with the RECRUITER role (current role:{" "}
          {sessionUser.role}).
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {fetchError && (
        <div
          className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          role="alert"
        >
          {fetchError}
        </div>
      )}

      <div>
        <h1 className="mb-4 text-2xl font-bold">Results</h1>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Candidate</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Passed</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 && (
              <tr>
                <td colSpan={3} className="border p-4 text-center text-slate-500">
                  No submissions for this exam yet.
                </td>
              </tr>
            )}
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

      <div>
        <h2 className="mb-4 text-xl font-bold">Proctoring logs</h2>

        <div className="max-h-64 overflow-y-auto border bg-gray-50 p-3">
          {logs.length === 0 && <p>No logs yet</p>}

          {logs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between border-b py-1 text-sm"
            >
              <span>
                {log.candidateId} — <strong>{log.eventType}</strong>
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
