"use client";

export default function ProblemPanel({ problem }: any) {
  if (!problem) return <div>Loading...</div>;

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold">{problem.title}</h2>
      <p className="mt-2">{problem.description}</p>

      <div className="mt-4">
        <strong>Sample Input:</strong>
        <pre>{problem.sampleInput}</pre>
      </div>

      <div className="mt-4">
        <strong>Sample Output:</strong>
        <pre>{problem.sampleOutput}</pre>
      </div>
    </div>
  );
}