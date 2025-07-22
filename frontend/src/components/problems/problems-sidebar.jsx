import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  CheckCircle,
  Circle,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { problemsAPI } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProblemsSidebar } from "./problems-sidebar-context";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProblemsSidebar() {
  const { id: currentProblemId } = useParams();
  const { isOpen, closeSidebar } = useProblemsSidebar();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await problemsAPI.getAll();
      setProblems(data);
    } catch (err) {
      setError(err.message || "Failed to fetch problems.");
    } finally {
      setLoading(false);
    }
  };

  // Real: check if problem._id is in user's solvedProblems
  const isSolved = (problem) =>
    user?.solvedProblems?.some(
      (pid) => (pid._id || pid) === (problem._id || problem.id)
    );

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Med.":
      case "Medium":
        return "text-amber-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Filter problems based on search term
  const filteredProblems = problems.filter(
    (problem) =>
      ((problem.name &&
        problem.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (problem.statement &&
          problem.statement
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) &&
      (difficultyFilter === "all" || problem.difficulty === difficultyFilter)
  );

  const handleProblemClick = () => {
    closeSidebar();
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSidebar]);

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    closed: {
      x: "-100%",
      filter: "blur(2px)",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
  };
  const overlayVariants = {
    open: { opacity: 1, pointerEvents: "auto", transition: { duration: 0.2 } },
    closed: {
      opacity: 0,
      pointerEvents: "none",
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md transition-all duration-300"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={closeSidebar}
            aria-label="Close sidebar overlay"
            tabIndex={-1}
          />
          <motion.aside
            key="sidebar-panel"
            className="fixed top-0 left-0 z-50 h-full w-1/3 min-w-[300px] max-w-lg bg-background border-r border-border shadow-lg theme-transition flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            role="complementary"
            aria-label="Problems sidebar"
            tabIndex={-1}
          >
            <div className="px-6 py-4 border-b border-border bg-background theme-transition">
              <div className="flex items-center justify-between">
                <Link to={"/problems"}>
                  <div className="flex flex-row items-center justify-center text-left text-muted-foreground theme-transition text-sm font-semibold">
                    Problems
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <button
                  className="p-1 rounded hover:bg-accent transition-colors"
                  onClick={closeSidebar}
                  aria-label="Close sidebar"
                  tabIndex={0}
                >
                  <X className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </button>
              </div>
            </div>
            <div className="relative p-3 px-5 flex items-center gap-2">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground theme-transition pointer-events-none" />
              <Input
                type="text"
                placeholder="Search problems..."
                aria-label="Search problems"
                className="pl-9 pr-4 py-2 h-9 text-sm !bg-card border-border text-foreground placeholder:text-muted-foreground !focus:ring-0 focus:border-transparent theme-transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger
                  id="difficulty-select"
                  className="w-[120px] shadow-none"
                >
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem
                    value="Easy"
                    className="text-green-500  focus:text-green-500 "
                  >
                    Easy
                  </SelectItem>
                  <SelectItem
                    value="Medium"
                    className="text-primary focus:text-primary  "
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="Hard"
                    className="text-destructive focus:text-destructive"
                  >
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar bg-background theme-transition">
              <div className="p-2 px-5 pt-0">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-muted animate-pulse rounded theme-transition"
                    />
                  ))
                ) : error ? (
                  <div className="mt-4 text-sm text-destructive theme-transition">
                    {error}
                  </div>
                ) : (
                  filteredProblems.map((problem) => (
                    <div key={problem._id} className="mb-3">
                      <Button
                        className={`bg-card border w-full justify-between h-auto p-3 theme-transition ${
                          currentProblemId === problem._id
                            ? "bg-primary/20 !text-primary hover:bg-primary/20 border-primary/30"
                            : "hover:bg-popover text-muted-foreground border-border"
                        }`}
                        onClick={handleProblemClick}
                        asChild
                      >
                        <Link to={`/problems/${problem._id}`}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex items-center gap-3 min-w-0">
                              {isSolved(problem) ? (
                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 theme-transition" />
                              ) : (
                                <Circle
                                  className={`h-4 w-4 shrink-0 theme-transition ${
                                    currentProblemId === problem._id
                                      ? "!text-primary"
                                      : "text-border"
                                  }`}
                                />
                              )}
                              {/* <span
                                className={`text-sm font-medium text-muted-foreground shrink-0 theme-transition ${
                                  currentProblemId === problem._id
                                    ? "!text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {index + 1}.
                              </span> */}
                              <span
                                className={`text-sm truncate min-w-0 text-foreground theme-transition ${
                                  currentProblemId === problem._id
                                    ? "!text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {problem.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-xs font-medium theme-transition ${getDifficultyColor(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty === "Medium"
                                ? "Med."
                                : problem.difficulty}
                            </span>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
