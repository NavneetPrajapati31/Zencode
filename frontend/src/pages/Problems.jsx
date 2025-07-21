"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";
import { problemsAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

// Progress bar component for demo
const ProgressBar = () => (
  <div className="flex space-x-0.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="w-1 h-4 bg-primary rounded-sm" />
    ))}
  </div>
);

// Problem form modal component
function ProblemFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    statement: "",
    name: "",
    code: "",
    difficulty: "Medium",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        statement: initialData.statement || "",
        name: initialData.name || "",
        code: initialData.code || "",
        difficulty: initialData.difficulty || "Medium",
      });
    } else {
      setForm({
        statement: "",
        name: "",
        code: "",
        difficulty: "Medium",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDifficultyChange = (value) => {
    setForm({ ...form, difficulty: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-lg transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto rounded-lg bg-card border border-border shadow-lg px-6 py-4 text-left relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="p-0 mb-4">
          <div className="font-medium text-lg">
            {initialData ? "Edit Problem" : "Create New Problem"}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground font-normal mb-2">
              Name
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Problem name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground  font-normal mb-2">
              Statement
            </label>
            <textarea
              name="statement"
              value={form.statement}
              onChange={handleChange}
              placeholder="Problem statement"
              className="w-full min-h-[100px] p-3 text-sm border border-muted focus:outline-none focus:border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground  font-normal mb-2">
              Code Template
            </label>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Code template"
              className="w-full min-h-[100px] p-3 text-sm border border-muted focus:outline-none focus:border-border rounded-md font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground  font-normal mb-2">
              Difficulty
            </label>
            <Select
              value={form.difficulty}
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger
                className="w-full p-3 text-sm text-muted-foreground  border border-muted focus:outline-none focus:border-border rounded-md"
                aria-label="Select difficulty"
              >
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 px-0 py-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-1/2">
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const username = user?.username;
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProblem, setEditProblem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      fetchProblems();
    }
  }, [authLoading]);

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

  // Check if the current user has solved this problem
  const isSolved = (problem) => {
    if (!user || !user.solvedProblems) return false;
    return user.solvedProblems.some(
      (solvedProblem) =>
        solvedProblem._id === problem._id || solvedProblem === problem._id
    );
  };

  // Restore getDifficultyColor for badge coloring
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Med.":
      case "Medium":
        return "text-amber-500";
      case "Hard":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  // Filter problems based on search term (search in name and statement)
  const filteredProblems = problems.filter(
    (problem) =>
      (problem.name &&
        problem.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (problem.statement &&
        problem.statement.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async (form, setError) => {
    setModalLoading(true);
    try {
      await problemsAPI.create(form);
      setShowModal(false);
      fetchProblems();
    } catch (err) {
      setError(err.message || "Failed to create problem.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = (problem) => {
    setEditProblem(problem);
    setShowModal(true);
  };

  const handleUpdate = async (form, setError) => {
    setModalLoading(true);
    try {
      await problemsAPI.update(editProblem._id, form);
      setShowModal(false);
      setEditProblem(null);
      fetchProblems();
    } catch (err) {
      setError(err.message || "Failed to update problem.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await problemsAPI.delete(deleteId);
      setDeleteId(null);
      fetchProblems();
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add useEffect for delete modal scroll lock
  useEffect(() => {
    if (deleteId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [deleteId]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading problems...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <div className="max-w-full mx-auto rounded-lg shadow-none px-6 sm:px-12 mb-8 theme-transition">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-3 theme-transition">
          <Link to={`/profile/${username}`}>
            <Button
              className="bg-card text-muted-foreground border border-border hover:bg-card font-medium flex items-center gap-2 !shadow-none theme-transition"
              aria-label="back to dashboard"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Profile
            </Button>
          </Link>
          <div className="relative flex-grow w-full sm:w-auto theme-transition">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground theme-transition" />
            <Input
              type="text"
              placeholder="Search questions"
              className="pl-10 pr-4 py-2 rounded-md !bg-card placeholder:text-muted-foreground border border-border !focus:ring-0 focus:border-transparent w-full !shadow-none theme-transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search problems"
            />
          </div>
          {isAuthenticated && user?.role === "admin" && (
            <Button
              className="bg-card text-muted-foreground border border-border hover:bg-card font-medium flex items-center gap-2 theme-transition"
              onClick={() => {
                setEditProblem(null);
                setShowModal(true);
              }}
              aria-label="Add Problem"
            >
              <Plus className="w-4 h-4" /> Add Problem
            </Button>
          )}
        </div>
        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem, idx) => {
            return (
              <Card
                key={problem._id}
                className="flex flex-row items-center justify-between p-4 rounded-md cursor-pointer bg-card border border-border focus-within:ring-0 focus-within:outline-0 theme-transition hover:bg-accent/50 shadow-none"
              >
                <Link
                  to={`/problems/${problem._id}`}
                  tabIndex={0}
                  aria-label={`Open problem ${problem.name}`}
                  className="flex flex-row items-center justify-between focus:outline-none focus:ring-0 rounded-md flex-1 min-w-0"
                >
                  <div className="flex items-center min-w-0 max-w-[70%] flex-shrink-0">
                    {isSolved(problem) ? (
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    ) : (
                      <span className="h-5 w-5 border-2 border-muted rounded-full shrink-0 inline-block mr-3" />
                    )}
                    <span className="text-base font-medium text-foreground mr-2 shrink-0 theme-transition">
                      {idx + 1}.
                    </span>
                    <span className="text-base font-medium text-foreground truncate min-w-0 theme-transition">
                      {problem.name}
                    </span>
                  </div>
                  {/* Right: Difficulty badge and ProgressBar */}
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty === "Medium"
                        ? "Med."
                        : problem.difficulty}
                    </span>
                    {/* <ProgressBar /> */}
                  </div>
                </Link>

                {/* Author controls */}
                {isAuthenticated && user?.role === "admin" && (
                  <div className="flex gap-2 ml-0">
                    <Button
                      size="sm"
                      className="bg-accent text-muted-foreground flex items-center gap-1 hover:bg-muted shadow-none theme-transition"
                      onClick={() => handleEdit(problem)}
                      aria-label="Edit problem"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/20 theme-transition shadow-none"
                      onClick={() => setDeleteId(problem._id)}
                      aria-label="Delete problem"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProblems.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? "No problems found matching your search."
              : "No problems available."}
          </div>
        )}
      </div>

      {/* Problem Form Modal */}
      <ProblemFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditProblem(null);
        }}
        onSubmit={editProblem ? handleUpdate : handleCreate}
        initialData={editProblem}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-lg transition-all duration-300"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-md mx-auto rounded-xl bg-card border border-border shadow-none px-6 py-4 text-left relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <div className="mb-4 font-medium text-md">Delete Problem</div>
            <p className="mb-4 text-sm text-muted-foreground">
              Are you sure you want to delete this problem? This action cannot
              be undone.
            </p>
            <div className="flex flex-row gap-2 px-0 py-2">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="w-1/2 !bg-destructive text-destructive-foreground"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
