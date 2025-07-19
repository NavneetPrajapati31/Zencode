"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/use-auth";
import { problemsAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet as Dialog,
  SheetContent as DialogContent,
  SheetHeader as DialogHeader,
  SheetTitle as DialogTitle,
  SheetFooter as DialogFooter,
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Problem" : "Create New Problem"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Problem name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Statement</label>
            <textarea
              name="statement"
              value={form.statement}
              onChange={handleChange}
              placeholder="Problem statement"
              className="w-full min-h-[100px] p-3 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Code Template
            </label>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Code template"
              className="w-full min-h-[100px] p-3 border rounded-md font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProblemsPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
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

  // For demo: treat problems with percentage >= 50 as solved
  const isSolved = (problem) => problem.solved || problem.percentage >= 50;

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
    <div className="min-h-screen bg-background text-foreground px-4">
      <div className="max-w-full mx-auto rounded-lg shadow-lg p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-3">
          <Link to={"/dashboard"}>
            <Button
              className="font-medium flex items-center gap-2"
              aria-label="back to dashboard"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions"
              className="pl-10 pr-4 py-2 rounded-md bg-background border border-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search problems"
            />
          </div>
          {isAuthenticated && user?.role === "admin" && (
            <Button
              className="font-medium flex items-center gap-2"
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
                className="flex flex-row items-center justify-between p-4 rounded-md cursor-pointer transition-colors duration-200 bg-card border border-border focus-within:ring-0 focus-within:outline-0"
              >
                <Link
                  to={`/problems/${problem._id}`}
                  tabIndex={0}
                  aria-label={`Open problem ${problem.name}`}
                  className="flex flex-row items-center justify-between focus:outline-none focus:ring-0 rounded-md flex-1 min-w-0"
                >
                  <div className="flex items-center min-w-0 max-w-[70%] flex-shrink-0">
                    {isSolved(problem) ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    ) : (
                      <span className="h-5 w-5 border-2 border-muted rounded-full shrink-0 inline-block mr-3" />
                    )}
                    <span className="text-base font-medium text-foreground mr-2 shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="text-base font-medium text-foreground truncate min-w-0">
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
                    <ProgressBar />
                  </div>
                </Link>

                {/* Author controls */}
                {isAuthenticated && user?.role === "admin" && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="flex items-center gap-1"
                      onClick={() => handleEdit(problem)}
                      aria-label="Edit problem"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="flex items-center gap-1 text-destructive hover:text-destructive"
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
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Problem</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this problem? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
