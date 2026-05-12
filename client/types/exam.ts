/** Problem shape returned from GET /exams with included problems */
export type ExamProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  sampleInput: string;
  sampleOutput: string;
  marks: number;
  examId?: string;
};
