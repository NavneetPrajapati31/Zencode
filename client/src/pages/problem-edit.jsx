import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById, updateProblem } from "../lib/api";
import ProblemForm from "../components/problem-form";
import { getUserIdFromToken } from "../lib/utils";

const ProblemEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    getProblemById(id)
      .then(setProblem)
      .catch(() => setError("Failed to load problem"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await updateProblem(id, data, token);
      navigate(`/problems/${id}`);
    } catch {
      setSubmitError("Failed to update problem");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const isCreator =
    problem &&
    problem.createdBy &&
    (problem.createdBy._id === userId || problem.createdBy === userId);
  if (!isCreator) return <div className="p-4 text-red-500">Unauthorized</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Problem</h1>
      <ProblemForm
        onSubmit={handleSubmit}
        initialData={problem}
        loading={submitting}
        error={submitError}
      />
    </div>
  );
};

export default ProblemEditPage;
