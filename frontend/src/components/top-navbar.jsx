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

export default function TopNavbar({ onRun, onSubmit, codeEditorRef }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiReviewing, setIsAiReviewing] = useState(false);

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
    try {
      const code = codeEditorRef?.current?.getCode?.();
      if (!code) {
        console.log("No code to review.");
        setIsAiReviewing(false);
        return;
      }
      const res = await fetch("http://localhost:8000/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        console.log("AI review failed. Try again later.");
        setIsAiReviewing(false);
        return;
      }
      const data = await res.json();
      console.log(
        "AI Review Result:",
        data.aiResponse || "No response from AI."
      );
    } catch {
      console.log("AI review failed. Try again later.");
    } finally {
      setIsAiReviewing(false);
    }
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
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Shuffle"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleRun}
          disabled={isRunning}
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Run code"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Submit code"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={handleAiReview}
          disabled={isAiReviewing}
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="AI Review"
        >
          {isAiReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RiGeminiFill className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Stop"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="theme-transition-fast"
          aria-label="Grid view"
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>

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
            <Button
              variant="ghost"
              size="icon"
              className="theme-transition-fast"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-56 shadow-none theme-transition"
          >
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
              onClick={toggleTheme}
              disabled={isTransitioning}
              className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground theme-transition-fast"
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
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive cursor-pointer theme-transition-fast"
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
