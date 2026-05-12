"use client";

import type { ExamProblem } from "@/types/exam";

export type QuestionSidebarProps = {
  problems: ExamProblem[];
  activeProblemId: string | null;
  onSelectProblem: (problemId: string) => void;
  markedForReview: Readonly<Record<string, boolean>>;
  onToggleReview: (problemId: string) => void;
  attempted: Readonly<Record<string, boolean>>;
  solved: Readonly<Record<string, boolean>>;
  className?: string;
};

function StatusIndicators({
  problemId,
  attempted,
  solved,
}: {
  problemId: string;
  attempted: Readonly<Record<string, boolean>>;
  solved: Readonly<Record<string, boolean>>;
}) {
  const done = solved[problemId];
  const tried = attempted[problemId];

  if (done) {
    return (
      <span
        className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
        title="Solved"
      >
        Solved
      </span>
    );
  }
  if (tried) {
    return (
      <span
        className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900"
        title="Attempted"
      >
        Attempted
      </span>
    );
  }
  return (
    <span
      className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500"
      title="Not attempted"
    >
      New
    </span>
  );
}

export default function QuestionSidebar({
  problems,
  activeProblemId,
  onSelectProblem,
  markedForReview,
  onToggleReview,
  attempted,
  solved,
  className = "",
}: QuestionSidebarProps) {
  return (
    <aside
      className={`flex shrink-0 flex-col border-slate-200 bg-slate-50 lg:h-full lg:w-60 lg:border-r lg:p-2 ${className}`}
      aria-label="Exam problems"
    >
      <h2 className="hidden px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:block">
        Problems
      </h2>
      <ul className="flex flex-row gap-2 overflow-x-auto p-2 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:p-0">
        {problems.map((p, index) => {
          const isActive = p.id === activeProblemId;
          const isReview = markedForReview[p.id];

          return (
            <li key={p.id} className="w-full shrink-0 lg:shrink-0">
              <div
                className={`flex max-w-[18rem] items-stretch overflow-hidden rounded-lg border transition-colors lg:max-w-none ${
                  isActive
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectProblem(p.id)}
                  className="flex min-w-40 flex-1 flex-col gap-1 px-3 py-2 text-left lg:min-w-0"
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Q{index + 1}
                    </span>
                    <StatusIndicators
                      problemId={p.id}
                      attempted={attempted}
                      solved={solved}
                    />
                  </div>
                  <span className="line-clamp-2 text-sm font-medium text-slate-900">
                    {p.title}
                  </span>
                  {isReview && (
                    <span className="text-[11px] font-medium text-amber-700">
                      Marked for review
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  title={
                    isReview ? "Remove review flag" : "Mark for review"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleReview(p.id);
                  }}
                  className={`flex w-10 shrink-0 items-center justify-center border-l border-slate-200 text-base ${
                    isReview
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-900"
                  }`}
                >
                  {isReview ? "★" : "☆"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
