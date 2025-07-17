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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TopNavbar({ onRun, onSubmit }) {
  return (
    <nav className="flex items-center justify-between bg-slate-950 text-slate-400 p-3 border-b border-slate-800">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Link to={"/problems"}>
          <div className="flex items-center space-x-2 text-slate-400 p-1">
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
          className="bg-slate-800 text-slate-400 !px-3 !py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer"
          onClick={onRun}
          aria-label="Run code"
        >
          <Play className="h-3 w-3" />
          <span className="text-sm">Run</span>
        </button>
        <button
          className="bg-green-600/20 text-green-400 !px-3 !py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer"
          onClick={onSubmit}
          aria-label="Submit code"
        >
          <CloudUpload className="h-3 w-3" />
          <span className="text-sm">Submit</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="text-slate-400 p-1 rounded-md flex items-center justify-center">
          <User className="h-5 w-5" />
          <span className="sr-only">User Profile</span>
        </button>
      </div>
    </nav>
  );
}
