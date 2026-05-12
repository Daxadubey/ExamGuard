import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <h1 className="text-4xl font-semibold">ExamVerse</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            Welcome to your exam monitoring and coding assessment platform. Use the links below to open the recruiter dashboard or start an exam.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/recruiter"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Recruiter Dashboard
            </Link>
            <Link
              href="/exam/446eadc3-12ee-43ee-b749-8db1cffe4729"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
