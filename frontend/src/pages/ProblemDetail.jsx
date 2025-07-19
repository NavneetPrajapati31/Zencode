import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/use-auth";
import { problemsAPI, problemDetailsAPI, testCasesAPI } from "@/utils/api";
import TopNavbar from "@/components/top-navbar";
import ProblemDescription from "@/components/problem-description";
import CodeEditorPanel from "@/components/code-editor-panel";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [problemDetails, setProblemDetails] = useState(null);
  const [testcases, setTestcases] = useState([]);
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

    const fetchProblemData = async () => {
      try {
        // Try to get the full problem with details first
        const fullProblem = await problemDetailsAPI.getFullProblem(id);
        setProblem(fullProblem.problem);
        setProblemDetails(fullProblem.details);
      } catch {
        // If full problem fetch fails, try to get just the problem
        try {
          const problemData = await problemsAPI.getById(id);
          setProblem(problemData);
          setProblemDetails(null);
        } catch {
          setError("Failed to fetch problem.");
        }
      }

      // Fetch testcases for this problem
      try {
        const testcasesData = await testCasesAPI.getByProblemId(id);
        setTestcases(testcasesData);
      } catch {
        // No testcases found for this problem
        setTestcases([]);
      }
    };

    fetchProblemData();
  }, [id]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground theme-transition">
        Loading problem...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive theme-transition">
        {error}
      </div>
    );
  }
  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground theme-transition">
        Problem not found.
      </div>
    );
  }

  // Combine problem and details for the components
  const combinedProblem = {
    ...problem,
    // Map the new field names to what the components expect
    title: problem.name,
    description: problem.statement,
    // Add testcases
    testcases: testcases,
    hiddenTestcases: [], // For now, treat all testcases as public
    // Add details if available
    ...(problemDetails && {
      tags: problemDetails.tags,
      constraints: problemDetails.constraints,
      examples: problemDetails.examples,
      boilerplate: problemDetails.boilerplate,
      harness: problemDetails.harness,
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col theme-transition">
      <TopNavbar
        onRun={() => codeEditorRef.current?.run()}
        onSubmit={() => codeEditorRef.current?.submit()}
        codeEditorRef={codeEditorRef}
      />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row theme-transition">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto no-scrollbar border-b lg:border-b-0 lg:border-r border-border bg-background theme-transition">
          <ProblemDescription problem={combinedProblem} />
        </div>
        {/* Right Panel: Code Editor and Test Cases */}
        <div className="w-full lg:w-1/2 overflow-y-auto no-scrollbar bg-card theme-transition">
          <CodeEditorPanel ref={codeEditorRef} problem={combinedProblem} />
        </div>
      </div>
    </div>
  );
}
