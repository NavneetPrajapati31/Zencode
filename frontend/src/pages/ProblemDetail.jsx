import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/use-auth";
import { problemsAPI } from "@/utils/api";
import TopNavbar from "@/components/top-navbar";
import ProblemDescription from "@/components/problem-description";
import CodeEditorPanel from "@/components/code-editor-panel";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const codeEditorRef = useRef();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    setError("");
    problemsAPI
      .getById(id)
      .then(setProblem)
      .catch((err) => setError(err.message || "Failed to fetch problem."));
  }, [id]);

  if (authLoading) {
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
        codeEditorRef={codeEditorRef}
      />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-background">
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
