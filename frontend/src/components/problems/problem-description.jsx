"use client";

import {
  CheckCircle,
  BookOpen,
  FlaskConical,
  FileText,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Share2,
  HelpCircle,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Sheet as Dialog,
  SheetContent as DialogContent,
  SheetHeader as DialogHeader,
  SheetTitle as DialogTitle,
  SheetFooter as DialogFooter,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/use-auth";
import { useEffect, useState } from "react";
import { problemsAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function ProblemDescription({ problem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProblem, setEditProblem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useAuth();
  const isSolved = user?.solvedProblems?.some(
    (pid) => (pid._id || pid) === (problem._id || problem.id)
  );

  if (!problem) {
    return (
      <div className="p-4 text-muted-foreground theme-transition">
        No problem data available.
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600/20 text-green-600";
      case "Med.":
      case "Medium":
        return "bg-primary/20 text-primary";
      case "Hard":
        return "bg-red-600/30 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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

  return (
    <div className="py-4 px-5 overflow-y-auto no-scrollbar bg-transparent text-foreground theme-transition">
      {/* Tabs */}
      <div className="w-full theme-transition">
        <div className="theme-transition">
          {/* Problem Title and Solved Status */}
          <div className="flex items-center justify-between mb-4 theme-transition">
            <h1 className="!text-lg text-left font-medium theme-transition">
              {problem.title}
            </h1>
            {isSolved && user?.role === "user" && (
              <span className="text-green-500 flex items-center space-x-1 theme-transition">
                <CheckCircle className="h-4 w-4 theme-transition" />
              </span>
            )}
            {/* Admin-only: Edit/Delete buttons */}
            {user?.role === "admin" && (
              <div className="flex gap-2">
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
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 theme-transition">
            <span
              className={`text-sm font-light px-3 py-0.5 rounded-full theme-transition ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty || "Unknown"}
            </span>
            {/* Add more tags if available in problem object */}
          </div>
          {/* Problem Statement */}
          <div className="text-foreground leading-relaxed space-y-4 !text-md font-normal text-left theme-transition">
            <p className="theme-transition">{problem.description}</p>
            {/* Render examples if available */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4 theme-transition">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="theme-transition">
                    <h3 className="font-medium text-muted-foreground text-md mb-2 theme-transition">
                      Example {i + 1}:
                    </h3>
                    <div className="bg-muted p-3 rounded-md text-md theme-transition">
                      <pre className="whitespace-pre-wrap break-words theme-transition">
                        <code className="block theme-transition">
                          Input: {ex.input}
                        </code>
                        <code className="block theme-transition">
                          Output: {ex.output}
                        </code>
                        {ex.explanation && (
                          <code className="block theme-transition">
                            Explanation: {ex.explanation}
                          </code>
                        )}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-1 theme-transition">
                <h3 className="font-medium text-md text-muted-foreground text-md theme-transition">
                  Constraints:
                </h3>
                <ul className="list-disc list-inside text-md space-y-1 theme-transition">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="theme-transition">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
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
