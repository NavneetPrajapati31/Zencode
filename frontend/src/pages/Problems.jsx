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
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { problemsAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";

const ProgressBar = () => (
  <div className="flex space-x-0.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="w-1 h-4 bg-gray-500 rounded-sm" />
    ))}
  </div>
);

const initialFormState = {
  title: "",
  description: "",
  difficulty: "Easy",
  tags: [],
  testcases: [{ input: "", output: "" }],
  hiddenTestcases: [],
  constraints: [],
  examples: [],
  boilerplate: {},
  harness: {},
};

function ProblemFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(initialData || initialFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData || initialFormState);
    setError("");
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, idx, key, value) => {
    setForm((prev) => {
      const arr = [...(prev[field] || [])];
      arr[idx][key] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleAddArrayItem = (field, item) => {
    setForm((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  };

  const handleRemoveArrayItem = (field, idx) => {
    setForm((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.difficulty) {
      setError("Title, description, and difficulty are required.");
      return;
    }
    setError("");
    await onSubmit(form, setError);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-auto p-6 relative">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-white">
          {initialData ? "Edit Problem" : "Add Problem"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="mb-2"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full rounded-md bg-slate-800 border border-slate-700 p-2 text-zinc-100 min-h-[60px]"
              required
            />
          </div>
          <div className="flex gap-2">
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="rounded-md bg-slate-800 border border-slate-700 p-2 text-zinc-100"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <Input
              name="tags"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Tags (comma separated)"
            />
          </div>
          {/* Testcases */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Testcases
            </label>
            {form.testcases.map((tc, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={tc.input}
                  onChange={(e) =>
                    handleArrayChange("testcases", idx, "input", e.target.value)
                  }
                  placeholder="Input"
                  className="flex-1"
                  required
                />
                <Input
                  value={tc.output}
                  onChange={(e) =>
                    handleArrayChange(
                      "testcases",
                      idx,
                      "output",
                      e.target.value
                    )
                  }
                  placeholder="Output"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-400"
                  onClick={() => handleRemoveArrayItem("testcases", idx)}
                  aria-label="Remove testcase"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                handleAddArrayItem("testcases", { input: "", output: "" })
              }
              className="mt-1"
            >
              Add Testcase
            </Button>
          </div>
          {/* Constraints */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Constraints
            </label>
            {form.constraints.map((c, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={c}
                  onChange={(e) =>
                    handleArrayChange(
                      "constraints",
                      idx,
                      undefined,
                      e.target.value
                    )
                  }
                  placeholder="Constraint"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-400"
                  onClick={() => handleRemoveArrayItem("constraints", idx)}
                  aria-label="Remove constraint"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddArrayItem("constraints", "")}
              className="mt-1"
            >
              Add Constraint
            </Button>
          </div>
          {/* Examples */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Examples</label>
            {form.examples.map((ex, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={ex.input || ""}
                  onChange={(e) =>
                    handleArrayChange("examples", idx, "input", e.target.value)
                  }
                  placeholder="Input"
                  className="flex-1"
                />
                <Input
                  value={ex.output || ""}
                  onChange={(e) =>
                    handleArrayChange("examples", idx, "output", e.target.value)
                  }
                  placeholder="Output"
                  className="flex-1"
                />
                <Input
                  value={ex.explanation || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "examples",
                      idx,
                      "explanation",
                      e.target.value
                    )
                  }
                  placeholder="Explanation"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-400"
                  onClick={() => handleRemoveArrayItem("examples", idx)}
                  aria-label="Remove example"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                handleAddArrayItem("examples", {
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
              className="mt-1"
            >
              Add Example
            </Button>
          </div>
          {/* Boilerplate and Harness can be added similarly if needed */}
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editProblem, setEditProblem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Restore getDifficultyColor for badge coloring
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

  // Restore solvedCount and totalCount for header UI
  // const solvedCount = problems.filter(isSolved).length;
  // const totalCount = problems.length;

  const filteredProblems = problems.filter(
    (problem) =>
      (problem.title &&
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (problem.description &&
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-3">
          <Link to={"/dashboard"}>
            <Button
              className="!bg-blue-600/30 !text-blue-300 font-medium flex items-center gap-2"
              aria-label="back to dashboard"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
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
          {isAuthenticated && (
            <Button
              className="!bg-blue-600/30 !text-blue-300 font-medium flex items-center gap-2"
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
            const isAuthor =
              isAuthenticated &&
              user &&
              problem.createdBy &&
              ((typeof problem.createdBy === "string" &&
                problem.createdBy === user.id) ||
                (typeof problem.createdBy === "object" &&
                  problem.createdBy._id === user.id));
            return (
              <card
                key={problem._id}
                className="flex flex-row items-center justify-between !p-4 rounded-md cursor-pointer transition-colors duration-200 !bg-slate-900 !border-slate-800 focus-within:ring-0 focus-within:outline-0"
              >
                <Link
                  to={`/problems/${problem._id}`}
                  tabIndex={0}
                  aria-label={`Open problem ${problem.title}`}
                  className="flex flex-row items-center justify-between focus:outline-none focus:ring-0 rounded-md flex-1 min-w-0"
                >
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
                {isAuthor && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      className="flex items-center gap-1 !bg-blue-600/30 !text-blue-300"
                      onClick={() => handleEdit(problem)}
                      aria-label="Edit problem"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 !bg-red-600/30 !text-red-400"
                      onClick={() => setDeleteId(problem._id)}
                      aria-label="Delete problem"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                )}
              </card>
            );
          })}
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
      {/* Create/Edit Modal */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Delete Problem
            </h2>
            <p className="mb-4 text-slate-300">
              Are you sure you want to delete this problem? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
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
