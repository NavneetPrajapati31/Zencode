import React, { useState } from "react";

const difficulties = ["Easy", "Medium", "Hard"];

const ProblemForm = ({ onSubmit, initialData = {}, loading, error }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [difficulty, setDifficulty] = useState(
    initialData.difficulty || "Easy"
  );
  const [tags, setTags] = useState(
    initialData.tags ? initialData.tags.join(", ") : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      difficulty,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Problem Form"
    >
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block font-medium mb-1" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-label="Title"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-label="Description"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="difficulty">
          Difficulty
        </label>
        <select
          id="difficulty"
          className="w-full border rounded px-3 py-2"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Difficulty"
        >
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="tags">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          aria-label="Tags"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
        aria-label="Submit Problem"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ProblemForm;
