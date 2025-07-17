"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowUpDown,
  Filter,
  Shuffle,
  CheckCircle,
  LayoutDashboard,
  Folder,
  X,
} from "lucide-react";
import { problemsAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400";
    case "Med.":
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

const ProgressBar = () => (
  <div className="flex space-x-0.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="w-1 h-4 bg-gray-500 rounded-sm" />
    ))}
  </div>
);

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [authLoading, isAuthenticated, navigate]);

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

  // For demo: treat problems with percentage >= 50 as solved
  const isSolved = (problem) => problem.solved || problem.percentage >= 50;
  const solvedCount = problems.filter(isSolved).length;
  const totalCount = problems.length;

  const filteredProblems = problems.filter(
    (problem) =>
      (problem.title &&
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (problem.description &&
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading problems...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 px-4">
      <div className="max-w-full mx-auto rounded-lg shadow-lg p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search questions"
              className="pl-10 pr-4 py-2 rounded-md !bg-slate-900 border !border-slate-800 text-zinc-100 !placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search problems"
            />
          </div>

          <div className="flex items-center space-x-4 ml-auto w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-2">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full border-2 border-gray-500" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-green-500"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
              </div>
              <span className="text-sm font-medium text-zinc-300">
                {solvedCount}/{totalCount} Solved
              </span>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem, idx) => (
            <Link
              to={`/problems/${problem._id}`}
              key={problem._id}
              tabIndex={0}
              aria-label={`Open problem ${problem.title}`}
              className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <Card className="flex flex-row items-center justify-between !p-4 rounded-md cursor-pointer transition-colors duration-200 !bg-slate-900 !border-slate-800 focus-within:ring-0 focus-within:outline-0">
                {/* Left: Checkmark, Number, Title */}
                <div className="flex items-center min-w-0 max-w-[70%] flex-shrink-0">
                  {isSolved(problem) ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <span className="h-5 w-5 border-2 border-slate-800 rounded-full shrink-0 inline-block mr-3" />
                  )}
                  <span className="text-base font-medium text-slate-400 mr-2 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-base font-medium text-slate-400 truncate min-w-0">
                    {problem.title}
                  </span>
                </div>
                {/* Right: Percentage, Difficulty, ProgressBar */}
                <div className="flex items-center gap-3 flex-shrink-0 ml-4 whitespace-nowrap">
                  {/* <span className="text-sm font-medium text-zinc-300">
                    {problem.percentage
                      ? `${problem.percentage.toFixed(1)}%`
                      : "0.0%"}
                  </span> */}
                  <span
                    className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}
                  >
                    {problem.difficulty === "Medium"
                      ? "Med."
                      : problem.difficulty}
                  </span>
                  <ProgressBar />
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
