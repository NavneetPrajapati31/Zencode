import React from "react";

const ProblemDetail = ({ problem, onEdit, onDelete, isCreator }) => {
  if (!problem) return <div className="p-4">Problem not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded">
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <div className="mb-2 text-gray-600">Difficulty: {problem.difficulty}</div>
      <div className="mb-2">
        Tags: {problem.tags && problem.tags.join(", ")}
      </div>
      <div className="mb-4 whitespace-pre-line">{problem.description}</div>
      {isCreator && (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            onClick={onEdit}
            aria-label="Edit Problem"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onEdit()}
          >
            Edit
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={onDelete}
            aria-label="Delete Problem"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onDelete()}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;
