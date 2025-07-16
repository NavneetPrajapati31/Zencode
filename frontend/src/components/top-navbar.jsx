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

export default function TopNavbar() {
  return (
    <nav className="flex items-center justify-between bg-zinc-800 p-3 border-b border-zinc-700">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-zinc-300">
          <List className="h-5 w-5" />
          <span className="font-medium hidden sm:block">Problem List</span>
        </div>
        <div className="flex space-x-1">
          <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous Problem</span>
          </button>
          <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next Problem</span>
          </button>
          <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
            <Shuffle className="h-5 w-5" />
            <span className="sr-only">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex items-center space-x-2">
        <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 px-3 py-1.5 rounded-md flex items-center space-x-1.5">
          <Play className="h-4 w-4" />
          <span>Run</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1.5">
          <CloudUpload className="h-4 w-4" />
          <span>Submit</span>
        </button>
        <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md hidden sm:flex items-center justify-center">
          <Square className="h-5 w-5" />
          <span className="sr-only">Toggle Layout</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md hidden sm:flex items-center justify-center">
          <Grid className="h-5 w-5" />
          <span className="sr-only">Grid View</span>
        </button>
        <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </button>
        <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
          <User className="h-5 w-5" />
          <span className="sr-only">User Profile</span>
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-3 py-1.5 rounded-md font-semibold hidden md:block">
          Premium
        </button>
      </div>
    </nav>
  );
}
