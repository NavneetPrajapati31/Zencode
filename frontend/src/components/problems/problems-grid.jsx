import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { problemsAPI, problemDetailsAPI } from "@/utils/api";
import { useAuth } from "@/components/auth/use-auth";
import { Card } from "@/components/ui/card";
import { CheckCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

function ProblemsGrid({ problems }) {
  // console.log("ProblemsGrid problems:", problems);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProblem, setEditProblem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!authLoading) setLoading(false);
  }, [authLoading]);

  // Debug: Log user and isAuthenticated before rendering admin controls
  useEffect(() => {
    // console.log("[ProblemsList] user:", user);
    // console.log("[ProblemsList] isAuthenticated:", isAuthenticated);
    const token =
      localStorage.getItem("token") || localStorage.getItem("tempToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // console.log("[ProblemsList] Decoded JWT payload:", payload);
      } catch {
        // console.log("[ProblemsList] Could not decode JWT:", e);
      }
    } else {
      // console.log("[ProblemsList] No token found in localStorage");
    }
  }, [user, isAuthenticated]);

  // Fetch problems and problem details (tags), then merge
  const fetchProblemsAndTags = async () => {
    setError("");
    setLoading(true);
    try {
      const [problemsData, detailsData] = await Promise.all([
        problemsAPI.getAll(),
        problemDetailsAPI.getAll(),
      ]);
      // Build a map of problemId (string) -> tags
      const tagsMap = {};
      detailsData.forEach((detail) => {
        // Use detail.problemId._id as the key
        if (
          detail.problemId &&
          detail.problemId._id &&
          Array.isArray(detail.tags)
        ) {
          tagsMap[detail.problemId._id] = detail.tags;
        }
      });
      // Merge tags into problems
      const merged = problemsData.map((problem) => ({
        ...problem,
        tags: tagsMap[problem._id] || [],
      }));
      // console.log("[ProblemsGrid] merged problems with tags:", merged);
      // setProblems(merged); // This line is removed as per the edit hint
    } catch (err) {
      setError(err.message || "Failed to fetch problems or tags.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get tags (fallback to empty array if not present)
  const getTags = (problem) =>
    Array.isArray(problem.tags) ? problem.tags : [];

  // Helper: get difficulty badge style
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-500";
      case "Medium":
      case "Med.":
        return "bg-primary/20 text-primary";
      case "Hard":
        return "bg-red-500/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCreate = async (form, setError) => {
    setModalLoading(true);
    try {
      await problemsAPI.create(form);
      setShowModal(false);
      // fetchProblemsAndTags();
    } catch (err) {
      setError(err.message || "Failed to create problem.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (form, setError) => {
    setModalLoading(true);
    try {
      await problemsAPI.update(editProblem._id, form);
      setShowModal(false);
      setEditProblem(null);
      // fetchProblemsAndTags();
    } catch (err) {
      setError(err.message || "Failed to update problem.");
    } finally {
      setModalLoading(false);
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    // Debug: Log Authorization header before making delete request
    const token =
      localStorage.getItem("token") || localStorage.getItem("tempToken");
    /* console.log(
      "[ProblemsList] handleDelete Authorization header:",
      token ? `Bearer ${token}` : "none"
    ); */
    try {
      await problemsAPI.delete(deleteId);
      setDeleteId(null);
      // fetchProblemsAndTags();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (problem) => {
    setEditProblem(problem);
    setShowModal(true);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[90vh] bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading problems...</div>
      </div>
    );
  }

  if (error) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }

  const isSolved = (problem) =>
    user?.solvedProblems?.some(
      (sp) => sp._id === problem._id || sp === problem._id
    );

  return (
    <>
      <div className="w-full mt-2 theme-transition">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <Card
              key={problem._id}
              className="flex flex-col justify-between h-full p-5 rounded-xl bg-card border border-border shadow-none hover:bg-accent/50 theme-transition cursor-pointer
              text-left gap-0"
            >
              <Link
                to={`/problems/${problem._id}`}
                tabIndex={0}
                aria-label={`Open problem ${problem.name}`}
                className="flex flex-col gap-2 focus:outline-none focus:ring-0 min-w-0 flex-1 p-0"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-md mr-1 font-medium truncate min-w-0 flex-1 text-foreground theme-transition">
                    {problem.name}
                  </h2>
                  {isSolved(problem) && (
                    <span className="text-green-500 flex items-center space-x-1 theme-transition">
                      <CheckCircle className="h-4 w-4 theme-transition" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-light text-muted-foreground line-clamp-2 min-h-[40px] theme-transition">
                  {problem.statement}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs ${getDifficultyBadge(problem.difficulty)}`}
                    aria-label={`Difficulty: ${problem.difficulty}`}
                  >
                    {problem.difficulty === "Medium"
                      ? "Medium"
                      : problem.difficulty}
                  </span>
                  {getTags(problem).map((tag) => (
                    <span
                      className={`px-3 py-1 rounded-md text-xs bg-muted text-muted-foreground capitalize theme-transition`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
              {/* Admin controls */}
              {isAuthenticated && user?.role === "admin" && (
                <div className="flex gap-2 mt-0">
                  <button
                    size="sm"
                    className="bg-accent rounded-md text-sm px-3 py-1 text-muted-foreground flex items-center gap-1 hover:bg-muted shadow-none theme-transition"
                    onClick={() => handleEdit(problem)}
                    aria-label="Edit problem"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button
                    size="sm"
                    className="bg-accent rounded-md text-sm px-3 py-1 flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/20 theme-transition shadow-none"
                    onClick={() => setDeleteId(problem._id)}
                    aria-label="Delete problem"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
        {problems.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No problems available.
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
    </>
  );
}

export default ProblemsGrid;
