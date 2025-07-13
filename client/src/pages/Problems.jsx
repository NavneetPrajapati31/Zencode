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
import { Label } from "@/components/ui/label";
import { Code2, Search, Trophy, Clock, Users } from "lucide-react";
import { problemsAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    statement: "",
    difficulty: "easy",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    difficulty: "Easy",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const {
    isAuthenticated,
    loading: authLoading,
    user,
    logout,
  } = useContext(AuthContext);
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
      (problem.title &&
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (problem.description &&
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-500";
    switch (difficulty.toLowerCase()) {
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

  const handleOpenAddModal = () => {
    setAddForm({ name: "", statement: "", difficulty: "easy" });
    setAddError("");
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      await problemsAPI.create({
        title: addForm.name,
        description: addForm.statement,
        difficulty:
          addForm.difficulty.charAt(0).toUpperCase() +
          addForm.difficulty.slice(1).toLowerCase(),
      });
      setShowAddModal(false);
      fetchProblems();
    } catch (err) {
      setAddError(err.message || "Failed to add problem.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenEditModal = (problem) => {
    setEditForm({
      id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
    });
    setEditError("");
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProblem = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      await problemsAPI.update(editForm.id, {
        title: editForm.title,
        description: editForm.description,
        difficulty:
          editForm.difficulty.charAt(0).toUpperCase() +
          editForm.difficulty.slice(1).toLowerCase(),
      });
      setShowEditModal(false);
      fetchProblems();
    } catch (err) {
      setEditError(err.message || "Failed to update problem.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProblem = async (id) => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await problemsAPI.delete(id);
      setDeleteId(null);
      fetchProblems();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete problem.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const isAuthor = (problem) => {
    if (!user) return false;
    if (!problem.createdBy) return false;
    return (problem.createdBy._id || problem.createdBy) === user.id;
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <h1 className="!text-lg font-bold text-white">Online Judge</h1>
            </div>
            <div className="items-center space-x-4 hidden md:flex">
              <Link to="/leaderboard">
                <Button
                  variant="outline"
                  className="!bg-gray-900 !border-gray-800 text-white hover:text-white"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="outline"
                  className="!bg-gray-900 !border-gray-800 text-white hover:text-white"
                >
                  Profile
                </Button>
              </Link>
              {isAuthenticated && (
                <Button
                  className="!bg-gray-900 text-white hover:text-white"
                  onClick={handleOpenAddModal}
                  aria-label="Add Problem"
                >
                  + Add Problem
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  className="!bg-gray-900  text-white hover:text-white"
                  onClick={() => {
                    logout();
                    navigate("/signin");
                  }}
                  aria-label="Logout"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseAddModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCloseAddModal();
              }}
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-white mb-4">
              Add New Problem
            </h2>
            <form onSubmit={handleAddProblem} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={addForm.name}
                  onChange={handleAddInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                  aria-label="Problem Name"
                />
              </div>
              <div>
                <Label htmlFor="statement" className="text-white">
                  Statement
                </Label>
                <textarea
                  id="statement"
                  name="statement"
                  value={addForm.statement}
                  onChange={handleAddInputChange}
                  className="bg-gray-800 border-gray-700 text-white rounded-md w-full p-2 min-h-[80px]"
                  required
                  aria-label="Problem Statement"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-white">
                  Difficulty
                </Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={addForm.difficulty}
                  onChange={handleAddInputChange}
                  className="bg-gray-800 border-gray-700 text-white rounded-md w-full p-2"
                  required
                  aria-label="Difficulty"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              {addError && (
                <div className="text-red-500 text-sm">{addError}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={addLoading}
                aria-label="Submit New Problem"
              >
                {addLoading ? "Adding..." : "Add Problem"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Problem Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCloseEditModal();
              }}
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Edit Problem</h2>
            <form onSubmit={handleEditProblem} className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-white">
                  Name
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  type="text"
                  value={editForm.title}
                  onChange={handleEditInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                  aria-label="Problem Name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-white">
                  Statement
                </Label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="bg-gray-800 border-gray-700 text-white rounded-md w-full p-2 min-h-[80px]"
                  required
                  aria-label="Problem Statement"
                />
              </div>
              <div>
                <Label htmlFor="edit-difficulty" className="text-white">
                  Difficulty
                </Label>
                <select
                  id="edit-difficulty"
                  name="difficulty"
                  value={editForm.difficulty}
                  onChange={handleEditInputChange}
                  className="bg-gray-800 border-gray-700 text-white rounded-md w-full p-2"
                  required
                  aria-label="Difficulty"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={editLoading}
                aria-label="Submit Edit Problem"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setDeleteId(null);
              }}
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-white mb-4">
              Delete Problem
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this problem? This action cannot
              be undone.
            </p>
            {deleteError && (
              <div className="text-red-500 text-sm mb-2">{deleteError}</div>
            )}
            <div className="flex gap-4">
              <Button
                className="bg-gray-700 hover:bg-gray-800 text-white flex-1"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                aria-label="Cancel Delete"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
                onClick={() => handleDeleteProblem(deleteId)}
                disabled={deleteLoading}
                aria-label="Confirm Delete"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
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
                      {problem.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-3">
                      {problem.description &&
                        problem.description.substring(0, 150)}
                      ...
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
                {isAuthor(problem) && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => handleOpenEditModal(problem)}
                      aria-label="Edit Problem"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setDeleteId(problem._id)}
                      aria-label="Delete Problem"
                    >
                      Delete
                    </Button>
                  </div>
                )}
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
