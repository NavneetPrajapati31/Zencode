import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "../lib/api";
import ProblemForm from "../components/problem-form";

const ProblemCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const problem = await createProblem(data, token);
      navigate(`/problems/${problem._id}`);
    } catch {
      setError("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated)
    return (
      <div className="p-4 text-red-500">
        Please sign in to create a problem.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Problem</h1>
      <ProblemForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default ProblemCreatePage;
