"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Search, Trophy, Clock, Users } from "lucide-react";
import { problemsAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";

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
    try {
      const data = await problemsAPI.getAll();
      setProblems(data);
    } catch (err) {
      setError(err.message || "Failed to fetch problems.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.statement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading problems...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Online Judge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/leaderboard">
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Code2 className="mr-1 h-4 w-4" />
                <span>{problems.length} Problems</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>Active Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem) => (
            <Card
              key={problem._id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">
                      {problem.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-3">
                      {problem.statement.substring(0, 150)}...
                    </CardDescription>
                  </div>
                  {problem.difficulty && (
                    <Badge
                      className={`${getDifficultyColor(
                        problem.difficulty
                      )} text-white ml-2`}
                    >
                      {problem.difficulty}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Problem #{problem.code}</span>
                  </div>
                  <Link to={`/problems/${problem._id}`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Solve
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <Code2 className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-400">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
