import {
  List,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  CloudUpload,
  Square,
  Grid,
  Settings,
  Bell,
  User,
  Loader2,
} from "lucide-react";
import { LuX } from "react-icons/lu";
import { RiGeminiFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "./use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";

// Sanitize markdown: remove code fences, normalize line breaks, remove non-breaking spaces, trim leading spaces
const cleanMarkdown = (str) =>
  (str || "")
    .replace(/```[a-z]*\n?/gi, "") // remove code fences
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/^[ \t]+/gm, "")
    .trim();

export default function TopNavbar({ onRun, onSubmit, codeEditorRef }) {
  const { user, logout } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiReviewing, setIsAiReviewing] = useState(false);
  const [aiReviewModalOpen, setAiReviewModalOpen] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState("");
  const [aiReviewError, setAiReviewError] = useState("");

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun?.();
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiReview = async () => {
    setIsAiReviewing(true);
    setAiReviewError("");
    setAiReviewResult("");
    try {
      const code = codeEditorRef?.current?.getCode?.();
      if (!code) {
        setAiReviewError("No code to review.");
        setIsAiReviewing(false);
        setAiReviewModalOpen(true);
        return;
      }
      const res = await fetch("http://localhost:8000/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setAiReviewError("AI review failed. Try again later.");
        setIsAiReviewing(false);
        setAiReviewModalOpen(true);
        return;
      }
      const data = await res.json();
      setAiReviewResult(data.aiResponse || "No response from AI.");
      setAiReviewModalOpen(true);
    } catch {
      setAiReviewError("AI review failed. Try again later.");
      setAiReviewModalOpen(true);
    } finally {
      setIsAiReviewing(false);
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setAiReviewModalOpen(false);
    setAiReviewResult("");
    setAiReviewError("");
  };

  return (
    <nav className="flex items-center justify-between bg-background text-foreground p-3 border-b border-border">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Link to={"/problems"}>
          <div className="flex items-center space-x-2 text-muted-foreground p-1">
            {/* <List className="h-5 w-5" />
          <span className="font-medium hidden sm:block">Problem List</span> */}
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium hidden sm:block">
              Back to problems
            </span>
          </div>
        </Link>
        {/* <div className="flex space-x-1">
          <button className="text-slate-400 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous Problem</span>
          </button>
          <button className="text-slate-400 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next Problem</span>
          </button>
          <button className="text-slate-400 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <Shuffle className="h-5 w-5" />
            <span className="sr-only">Shuffle</span>
          </button>
        </div> */}
      </div>

      {/* Middle Section */}
      <div className="flex items-center space-x-2">
        <button
          className="bg-accent text-accent-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60"
          onClick={handleRun}
          aria-label="Run code"
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="text-sm">Run</span>
        </button>
        <button
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60"
          onClick={handleSubmit}
          aria-label="Submit code"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-3 w-3" />
          )}
          <span className="text-sm">Submit</span>
        </button>
        <button
          className="bg-transparent text-cyan-300 px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 border border-cyan-300"
          onClick={handleAiReview}
          aria-label="AI Review code"
          disabled={isAiReviewing}
        >
          {isAiReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RiGeminiFill className="h-3 w-3" />
          )}
          <span className="text-sm">AI Review</span>
        </button>
      </div>

      {/* Modal for AI Review */}
      {aiReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="!bg-card border border-border text-foreground rounded-lg shadow-lg max-w-3xl w-full py-4 px-6 pb-6 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <button
              className="absolute top-5 right-5 text-foreground hover:cursor-pointer"
              onClick={handleCloseModal}
              aria-label="Close AI review modal"
              tabIndex={0}
            >
              <LuX className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-3">AI Code Review</h2>
            {isAiReviewing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Reviewing...</span>
              </div>
            ) : aiReviewError ? (
              <div className="text-destructive text-sm">{aiReviewError}</div>
            ) : (
              <div
                className="prose prose-sm prose-invert overflow-y-auto bg-card !p-6 rounded-xl border border-border text-left"
                style={{ maxHeight: "60vh" }}
              >
                {console.log("AI REVIEW RAW:", aiReviewResult)}
                <ReactMarkdown>{cleanMarkdown(aiReviewResult)}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="focus:outline-none focus-visible:ring-0 rounded-full"
              tabIndex={0}
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || user?.email || "User"}
                />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuLabel>
              <div className="flex items-center text-lg gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name || user?.email || "User"}
                  />
                  <AvatarFallback>
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive cursor-pointer"
              aria-label="Logout"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
