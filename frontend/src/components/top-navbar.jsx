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
import { useProblemsSidebar } from "./problems-sidebar-context";
import { motion, AnimatePresence } from "framer-motion";

// Sanitize markdown: remove code fences, normalize line breaks, remove non-breaking spaces, trim leading spaces
const cleanMarkdown = (str) =>
  (str || "")
    .replace(/```[a-z]*\n?/gi, "") // remove code fences
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/^[ \t]+/gm, "")
    .trim();

export default function TopNavbar({
  onRun,
  onSubmit,
  codeEditorRef,
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = false,
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useProblemsSidebar();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiReviewing, setIsAiReviewing] = useState(false);
  const [aiReviewModalOpen, setAiReviewModalOpen] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState("");
  const [aiReviewError, setAiReviewError] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handlePrevious = () => {
    if (canGoPrevious && onPrevious) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (canGoNext && onNext) {
      onNext();
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

  const handleOpenSettingsModal = () => setIsSettingsModalOpen(true);
  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background theme-transition">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            size="icon"
            className="bg-accent text-accent-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            onClick={toggleSidebar}
            aria-label="Toggle problems sidebar"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            size="icon"
            className="bg-accent text-accent-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            aria-label="Previous problem"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            size="icon"
            className="bg-accent text-accent-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            aria-label="Next problem"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="bg-accent text-muted-foreground border-none px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
          onClick={handleRun}
          aria-label="Run code"
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="text-sm font-medium">Run</span>
        </button>
        <button
          className="bg-green-600/20 text-green-500 px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60"
          onClick={handleSubmit}
          aria-label="Submit code"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-3 w-3" />
          )}
          <span className="text-sm font-medium">Submit</span>
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
          <span className="text-sm font-medium">AI Review</span>
        </button>
      </div>

      {/* Modal for AI Review */}
      <AnimatePresence>
        {aiReviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
            onClick={handleCloseModal}
          >
            <motion.div
              className="!bg-card border border-border text-foreground rounded-2xl shadow-lg max-w-2xl w-full pb-6 relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Browser-style header bar INSIDE the card */}
              <div
                className="w-full h-10 rounded-t-2xl bg-card flex items-center px-6 border-b border-border theme-transition"
                aria-label="Window controls"
                tabIndex={0}
              >
                <div className="flex space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-500 theme-transition-fast"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-yellow-500 theme-transition-fast"
                    aria-label="Minimize"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-500 theme-transition-fast"
                    aria-label="Maximize"
                  />
                </div>
              </div>
              {/* <button
                className="absolute top-5 right-5 text-muted-foreground hover:cursor-pointer"
                onClick={handleCloseModal}
                aria-label="Close AI review modal"
                tabIndex={0}
              >
                <LuX className="h-5 w-5" />
              </button>
              <h2 className="text-md text-muted-foreground text-left !font-medium mb-4">
                AI Code Review
              </h2> */}
              {isAiReviewing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Reviewing...</span>
                </div>
              ) : aiReviewError ? (
                <div className="text-destructive text-sm">{aiReviewError}</div>
              ) : (
                <div
                  className="prose prose-sm prose-invert overflow-y-auto no-scrollbar bg-card !p-6 !px-8 rounded-2xl text-left text-muted-foreground prose-mono"
                  style={{ maxHeight: "50vh" }}
                >
                  {console.log("AI REVIEW RAW:", aiReviewResult)}
                  <ReactMarkdown>{cleanMarkdown(aiReviewResult)}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
          onClick={handleCloseSettingsModal}
        >
          <div
            className="!bg-card border border-border text-foreground rounded-lg shadow-lg max-w-md w-full py-4 px-6 pb-6 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <button
              className="absolute top-5 right-5 text-foreground hover:cursor-pointer"
              onClick={handleCloseSettingsModal}
              aria-label="Close settings modal"
              tabIndex={0}
            >
              <LuX className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-3">Settings</h2>
            <div className="flex flex-col gap-4 mt-4">
              <button
                className="w-full text-left px-4 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-accent-foreground"
                tabIndex={0}
                aria-label="Profile settings"
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-accent-foreground"
                tabIndex={0}
                aria-label="Preferences settings"
              >
                Preferences
              </button>
              {/* Add more settings options here */}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Settings"
          tabIndex={0}
          onClick={handleOpenSettingsModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenSettingsModal();
            }
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
          <AnimatePresence>
            {dropdownOpen && (
              <DropdownMenuContent
                align="end"
                className="min-w-56 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                asChild
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
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
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </div>
    </nav>
  );
}
