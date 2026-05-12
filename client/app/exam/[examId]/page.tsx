"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import MonacoEditor from "@/components/Editor/MonacoEditor";
import ProblemPanel from "@/components/ProblemPanel";
import Timer from "@/components/Timer";
import ProctoringGuard from "@/components/ProctoringGuard";

export default function ExamPage() {
  const { examId } = useParams();

  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/exams");
      const exam = res.data.exams.find((e: any) => e.id === examId);

      setProblem(exam?.problems[0]);
    };

    fetchData();
  }, [examId]);

  const runCode = async () => {
    const res = await api.post("/submissions/run", {
      code,
      language,
      problemId: problem.id,
    });

    console.log(res.data);
  };

  const submitCode = async () => {
    await api.post("/submissions", {
      code,
      language,
      problemId: problem.id,
      examId,
    });

    alert("Submitted!");
  };

  return (
    <ProctoringGuard examId={examId as string}>
      <div className="h-screen flex flex-col">

        {/* Header */}
        <div className="p-4 flex justify-between bg-gray-800 text-white">
          <h1>Exam</h1>
          <Timer duration={60} />
        </div>

        {/* Body */}
        <div className="flex flex-1">
          {/* Left */}
          <div className="w-1/2 border-r">
            <ProblemPanel problem={problem} />
          </div>

          {/* Right */}
          <div className="w-1/2 flex flex-col">
            
            {/* Controls */}
            <div className="p-2 flex gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
              </select>

              <button onClick={runCode} className="bg-blue-500 px-3 py-1 text-white">
                Run
              </button>

              <button onClick={submitCode} className="bg-green-500 px-3 py-1 text-white">
                Submit
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1">
              <MonacoEditor
                code={code}
                setCode={setCode}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
    </ProctoringGuard>
  );
}