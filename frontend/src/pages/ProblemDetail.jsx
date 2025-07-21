import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";
import { problemsAPI, problemDetailsAPI, testCasesAPI } from "@/utils/api";
import TopNavbar from "@/components/layout/top-navbar";
import ProblemDescription from "@/components/problems/problem-description";
import CodeEditorPanel from "@/components/code-editor-panel";
import { ProblemsSidebar } from "@/components/problems/problems-sidebar";
import { ProblemsSidebarProvider } from "@/components/problems/problems-sidebar-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, History, RefreshCw } from "lucide-react";
import SubmissionList from "@/components/problems/submission-list";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [problemDetails, setProblemDetails] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [error, setError] = useState("");
  const [allProblems, setAllProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("description");
  const [submissionsRefreshKey, setSubmissionsRefreshKey] = useState(0);
  const codeEditorRef = useRef();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch all problems for navigation
  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const problems = await problemsAPI.getAll();
        setAllProblems(problems);
      } catch (error) {
        console.error("Failed to fetch all problems:", error);
      }
    };

    fetchAllProblems();
  }, []);

  // Find current problem index when problems and current id are available
  useEffect(() => {
    if (allProblems.length > 0 && id) {
      const index = allProblems.findIndex((p) => p._id === id);
      setCurrentProblemIndex(index);
    }
  }, [allProblems, id]);

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

  // Navigation handlers
  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      const previousProblem = allProblems[currentProblemIndex - 1];
      navigate(`/problems/${previousProblem._id}`);
    }
  };

  const handleNext = () => {
    if (currentProblemIndex < allProblems.length - 1) {
      const nextProblem = allProblems[currentProblemIndex + 1];
      navigate(`/problems/${nextProblem._id}`);
    }
  };

  const canGoPrevious = currentProblemIndex > 0;
  const canGoNext =
    currentProblemIndex >= 0 && currentProblemIndex < allProblems.length - 1;

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
    <ProblemsSidebarProvider>
      <ProblemsSidebar />
      <div className="h-screen bg-background text-foreground flex flex-col theme-transition no-scrollbar">
        <TopNavbar
          onRun={() => codeEditorRef.current?.run()}
          onSubmit={() => codeEditorRef.current?.submit()}
          codeEditorRef={codeEditorRef}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row theme-transition">
          {/* Left Panel: Problem Description with Tabs */}
          <div className="w-full lg:w-1/2 overflow-y-auto no-scrollbar lg:border-r border-border bg-background theme-transition flex flex-col">
            <Tabs
              defaultValue="description"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex flex-col flex-1 gap-0 theme-transition"
            >
              <div className="sticky top-0 z-10 bg-background theme-transition">
                <TabsList className="flex flex-row gap-1 bg-background py-6 px-5 rounded-none theme-transition">
                  <TabsTrigger
                    value="description"
                    className="flex items-center text-muted-foreground border-none rounded-md gap-1 !px-3 !py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-0 aria-selected:text-accent-foreground  cursor-pointer theme-transition transition-colors duration-200 ease-in-out"
                    aria-label="Description Tab"
                    tabIndex={0}
                  >
                    <FileText className="w-4 h-4" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="submissions"
                    className="flex items-center text-muted-foreground border-none rounded-md gap-1 !px-3 !py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-0 aria-selected:text-accent-foreground cursor-pointer theme-transition transition-colors duration-200 ease-in-out"
                    aria-label="Submissions Tab"
                    tabIndex={0}
                  >
                    <History className="w-4 h-4" />
                    Submissions
                  </TabsTrigger>
                </TabsList>
                <div className="w-full border-b border-border theme-transition" />
              </div>
              <TabsContent
                value="description"
                className="flex-1 theme-transition"
              >
                <ProblemDescription problem={combinedProblem} />
              </TabsContent>
              <TabsContent
                value="submissions"
                className="flex-1 theme-transition"
              >
                <SubmissionList
                  problemId={id}
                  refreshKey={submissionsRefreshKey}
                />
              </TabsContent>
            </Tabs>
          </div>
          {/* Right Panel: Code Editor and Test Cases */}
          <div className="w-full lg:w-1/2 overflow-y-auto no-scrollbar bg-card theme-transition">
            <CodeEditorPanel
              ref={codeEditorRef}
              problem={combinedProblem}
              onSubmissionCreated={() => setSubmissionsRefreshKey((k) => k + 1)}
            />
          </div>
        </div>
      </div>
    </ProblemsSidebarProvider>
  );
}
