"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import MonacoEditor from "@/components/Editor/MonacoEditor";
import ProblemPanel from "@/components/ProblemPanel";
import QuestionSidebar from "@/components/QuestionSidebar";
import Timer from "@/components/Timer";
import ProctoringGuard from "@/components/ProctoringGuard";
import type { ExamProblem } from "@/types/exam";

type ExamsResponse = {
  exams: Array<{ id: string; problems: ExamProblem[] }>;
};

export default function ExamPage() {
  const params = useParams();
  const examId =
    typeof params.examId === "string"
      ? params.examId
      : params.examId?.[0] ?? "";

  const [problems, setProblems] = useState<ExamProblem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);

  const [codeByProblemId, setCodeByProblemId] = useState<
    Record<string, string>
  >({});
  const [languageByProblemId, setLanguageByProblemId] = useState<
    Record<string, string>
  >({});

  const [markedForReview, setMarkedForReview] = useState<
    Record<string, boolean>
  >({});
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<ExamsResponse>("/exams");
        const exam = res.data.exams.find((e) => e.id === examId);
        const list = exam?.problems ?? [];
        setProblems(list);
        setLoadError(
          list.length ? null : "No problems found for this exam.",
        );
        setActiveProblemId(list[0]?.id ?? null);
      } catch {
        setLoadError("Could not load exam. Try refreshing.");
        setProblems([]);
        setActiveProblemId(null);
      }
    };

    if (examId) fetchData();
  }, [examId]);

  const activeProblem = useMemo(
    () => problems.find((p) => p.id === activeProblemId) ?? null,
    [problems, activeProblemId],
  );

  const activeIndex = useMemo(
    () => problems.findIndex((p) => p.id === activeProblemId),
    [problems, activeProblemId],
  );

  const code = activeProblemId
    ? (codeByProblemId[activeProblemId] ?? "")
    : "";
  const language = activeProblemId
    ? (languageByProblemId[activeProblemId] ?? "python")
    : "python";

  const setCode = useCallback(
    (value: string) => {
      if (!activeProblemId) return;
      setCodeByProblemId((prev) => ({
        ...prev,
        [activeProblemId]: value,
      }));
    },
    [activeProblemId],
  );

  const setLanguage = useCallback(
    (lang: string) => {
      if (!activeProblemId) return;
      setLanguageByProblemId((prev) => ({
        ...prev,
        [activeProblemId]: lang,
      }));
    },
    [activeProblemId],
  );

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) return;
    setActiveProblemId(problems[activeIndex - 1].id);
  }, [activeIndex, problems]);

  const goNext = useCallback(() => {
    if (activeIndex < 0 || activeIndex >= problems.length - 1) return;
    setActiveProblemId(problems[activeIndex + 1].id);
  }, [activeIndex, problems]);

  const toggleReviewForActive = useCallback(() => {
    if (!activeProblemId) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [activeProblemId]: !prev[activeProblemId],
    }));
  }, [activeProblemId]);

  const toggleReviewById = useCallback((problemId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  }, []);

  const runCode = async () => {
    if (!activeProblem || !activeProblemId) return;

    try {
      await api.post("/submissions/run", {
        code,
        language,
        problemId: activeProblem.id,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAttempted((prev) => ({ ...prev, [activeProblemId]: true }));
    }
  };

  const submitCode = async () => {
    if (!activeProblem || !activeProblemId) return;

    try {
      const res = await api.post<{
        result?: { passed: number; total: number };
      }>("/submissions", {
        code,
        language,
        problemId: activeProblem.id,
        examId,
      });

      const passed = res.data?.result?.passed;
      const total = res.data?.result?.total;
      if (
        typeof passed === "number" &&
        typeof total === "number" &&
        total > 0 &&
        passed === total
      ) {
        setSolved((prev) => ({ ...prev, [activeProblemId]: true }));
      }

      alert("Submitted!");
    } catch (e) {
      console.error(e);
      alert("Submit failed.");
    } finally {
      setAttempted((prev) => ({ ...prev, [activeProblemId]: true }));
    }
  };

  const canPrev = activeIndex > 0;
  const canNext = activeIndex >= 0 && activeIndex < problems.length - 1;

  return (
    <ProctoringGuard examId={examId}>
      <div className="flex h-dvh flex-col overflow-hidden bg-white">
        <header className="flex shrink-0 items-center justify-between bg-gray-800 p-4 text-white">
          <h1 className="text-lg font-semibold">Exam</h1>
          <Timer duration={60} />
        </header>

        {loadError && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            {loadError}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <QuestionSidebar
            problems={problems}
            activeProblemId={activeProblemId}
            onSelectProblem={setActiveProblemId}
            markedForReview={markedForReview}
            onToggleReview={toggleReviewById}
            attempted={attempted}
            solved={solved}
            className="max-h-[40vh] border-b lg:max-h-none"
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
            <ProblemPanel
              problem={activeProblem}
              className="min-h-[30vh] shrink-0 border-slate-200 md:min-h-0 md:w-1/2 md:border-r"
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col md:w-1/2">
              <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleReviewForActive}
                  disabled={!activeProblemId}
                  className={`rounded px-3 py-1.5 text-sm font-medium ${
                    activeProblemId && markedForReview[activeProblemId]
                      ? "bg-amber-200 text-amber-950"
                      : "bg-white text-slate-700 ring-1 ring-slate-300"
                  } disabled:opacity-40`}
                >
                  {activeProblemId && markedForReview[activeProblemId]
                    ? "Unmark review"
                    : "Mark for review"}
                </button>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                  aria-label="Language"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                </select>

                <button
                  type="button"
                  onClick={runCode}
                  className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Run
                </button>

                <button
                  type="button"
                  onClick={submitCode}
                  className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>

              <div className="min-h-0 flex-1 p-2 pt-0">
                <MonacoEditor
                  key={activeProblemId ?? "none"}
                  code={code}
                  setCode={setCode}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProctoringGuard>
  );
}
