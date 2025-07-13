import React, { useEffect, useState } from "react";
import { getProblems } from "../lib/api";
import { Link } from "react-router-dom";

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    getProblems()
      .then((data) => {
        console.log("Fetched problems:", data);
        setProblems(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load problems");
      })
      .finally(() => setLoading(false));
  }, []);

  console.log("problems:", problems, "error:", error, "loading:", loading);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Problems</h1>
        {isAuthenticated && (
          <Link
            to="/problems/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Problem
          </Link>
        )}
      </div>
      {problems.length === 0 ? (
        <div className="text-gray-500">No problems found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {problems.map((problem) => (
            <li key={problem._id} className="py-3">
              <Link
                to={`/problems/${problem._id}`}
                className="text-lg font-medium text-blue-700 hover:underline"
              >
                {problem.title}
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                [{problem.difficulty}]
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemsPage;
