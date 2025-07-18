import { useEffect, useState, useRef } from "react";
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
  const codeEditorRef = useRef();

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
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading problem...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
        {error}
      </div>
    );
  }
  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Problem not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNavbar
        onRun={() => codeEditorRef.current?.run()}
        onSubmit={() => codeEditorRef.current?.submit()}
      />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-card">
          <ProblemDescription problem={problem} />
        </div>
        {/* Right Panel: Code Editor and Test Cases */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-card">
          <CodeEditorPanel ref={codeEditorRef} problem={problem} />
        </div>
      </div>
    </div>
  );
}
