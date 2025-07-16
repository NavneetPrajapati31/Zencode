import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { problemsAPI } from "@/utils/api";
import TopNavbar from "@/components/top-navbar";
import ProblemDescription from "@/components/problem-description";
import CodeEditorPanel from "@/components/code-editor-panel";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    problemsAPI
      .getById(id)
      .then(setProblem)
      .catch((err) => setError(err.message || "Failed to fetch problem."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-100">
        Loading problem...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  if (!problem) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-100">
        Problem not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 flex flex-col">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800">
          <ProblemDescription problem={problem} />
        </div>
        {/* Right Panel: Code Editor and Test Cases */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <CodeEditorPanel problem={problem} />
        </div>
      </div>
    </div>
  );
}
