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
import Component from "@/components/comp-426";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemsList from "@/components/problems/problems-list";
import ProblemsGrid from "@/components/problems/problems-grid";
import { RiLayoutGridLine, RiListCheck } from "react-icons/ri";

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

export default function Dashboard() {
  const { loading: authLoading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProblem, setEditProblem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("grid-view");

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
          <div className="relative flex-grow w-full sm:w-auto theme-transition">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground theme-transition" />
            <Input
              type="text"
              placeholder="Search problems"
              className="pl-10 pr-4 py-2 rounded-md !bg-card placeholder:text-muted-foreground border border-border !focus:ring-0 focus:border-transparent w-full !shadow-none theme-transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search problems"
            />
          </div>

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
          {/* Tab Triggers */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="grid-view" className="cursor-pointer">
                <RiLayoutGridLine className="h-3 w-3" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="list-view" className="cursor-pointer">
                <RiListCheck className="h-3 w-3" />
                List View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Render selected tab content OUTSIDE */}
        <div>
          {selectedTab === "grid-view" && (
            <ProblemsGrid searchTerm={searchTerm} />
          )}
          {selectedTab === "list-view" && (
            <ProblemsList searchTerm={searchTerm} />
          )}
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
    </div>
  );
}
