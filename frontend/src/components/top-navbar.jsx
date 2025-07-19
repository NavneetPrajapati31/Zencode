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
  Sun,
  Moon,
} from "lucide-react";
import { LuX } from "react-icons/lu";
import { RiGeminiFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "./use-auth";
import { useTheme } from "./theme-context-utils";
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
  const { theme, toggleTheme } = useTheme();
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
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background theme-transition">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Toggle sidebar"
        >
          <List className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="theme-transition-fast"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="theme-transition-fast"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="bg-accent text-accent-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
          onClick={handleRun}
          aria-label="Run code"
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="text-sm font-semibold">Run</span>
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
          <span className="text-sm font-semibold">Submit</span>
        </button>
        <button
          className="bg-primary/20 text-primary px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 border border-none"
          onClick={handleAiReview}
          aria-label="AI Review code"
          disabled={isAiReviewing}
        >
          {isAiReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RiGeminiFill className="h-3 w-3" />
          )}
          <span className="text-sm font-semibold">AI Review</span>
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
                className="prose prose-sm prose-invert overflow-y-auto no-scrollbar bg-card !p-6 rounded-xl border border-border text-left"
                style={{ maxHeight: "60vh" }}
              >
                {console.log("AI REVIEW RAW:", aiReviewResult)}
                <ReactMarkdown>{cleanMarkdown(aiReviewResult)}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer"
              tabIndex={0}
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || user?.email || "User"}
                />
                <AvatarFallback className="text-sm border border-border">
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
          <DropdownMenuContent
            align="end"
            className="min-w-56 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <DropdownMenuLabel className="theme-transition">
              <div className="flex items-center text-lg gap-2 theme-transition">
                <Avatar className="h-10 w-10 theme-transition">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name || user?.email || "User"}
                  />
                  <AvatarFallback className="text-sm border border-border theme-transition">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col theme-transition">
                  <span className="font-medium text-sm theme-transition">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground theme-transition">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="theme-transition" />
            <DropdownMenuItem
              onClick={toggleTheme}
              className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground theme-transition"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTheme();
                }
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-primary theme-transition" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
              )}
              <span className="text-sm theme-transition">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive cursor-pointer theme-transition"
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
