import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById, deleteProblem } from "../lib/api";
import ProblemDetail from "../components/problem-detail";
import { getUserIdFromToken } from "../lib/utils";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    getProblemById(id)
      .then(setProblem)
      .catch(() => setError("Failed to load problem"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    navigate(`/problems/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;
    setDeleting(true);
    try {
      await deleteProblem(id, token);
      navigate("/problems");
    } catch {
      setError("Failed to delete problem");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const isCreator =
    problem &&
    problem.createdBy &&
    (problem.createdBy._id === userId || problem.createdBy === userId);

  return (
    <ProblemDetail
      problem={problem}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isCreator={isCreator && !deleting}
    />
  );
};

export default ProblemDetailPage;
