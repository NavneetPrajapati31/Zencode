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

export default function TopNavbar({ onRun, onSubmit }) {
  const { user, logout } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          className="bg-muted text-foreground px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60"
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
      </div>

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
