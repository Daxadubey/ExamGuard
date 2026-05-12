"use client";

import type { ExamProblem } from "@/types/exam";

type ProblemPanelProps = {
  problem: ExamProblem | null;
  className?: string;
};

export default function ProblemPanel({
  problem,
  className = "",
}: ProblemPanelProps) {
  if (!problem) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-slate-500">Loading problem…</p>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto p-4 ${className}`}
    >
      <h2 className="text-xl font-bold text-slate-900">{problem.title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-slate-700">
        {problem.description}
      </p>

      <div className="mt-4">
        <strong className="text-slate-800">Sample Input:</strong>
        <pre className="mt-1 overflow-x-auto rounded border border-slate-200 bg-slate-50 p-3 text-sm">
          {problem.sampleInput}
        </pre>
      </div>

      <div className="mt-4">
        <strong className="text-slate-800">Sample Output:</strong>
        <pre className="mt-1 overflow-x-auto rounded border border-slate-200 bg-slate-50 p-3 text-sm">
          {problem.sampleOutput}
        </pre>
      </div>
    </div>
  );
}
