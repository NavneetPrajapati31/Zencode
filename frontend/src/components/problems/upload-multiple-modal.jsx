import { useState } from "react";
import { problemsAPI } from "@/utils/api";
import { Button } from "../ui/button";

function UploadMultipleModal({ open, onClose, onSuccess }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const example = `[
  {
    "name": "Two Sum",
    "statement": "Given an array of integers...",
    "code": "def twoSum(nums, target): ...",
    "difficulty": "Easy",
    "tags": ["array", "hashmap"],
    "constraints": ["2 <= nums.length <= 10^4"],
    "examples": [{"input": "[2,7,11,15] 9", "output": "[0,1]", "explanation": "..."}],
    "boilerplate": {"python": "def twoSum(nums, target): ..."},
    "harness": {"python": "# test code"},
    "originalId": "123abc",
    "testcases": [
      {"input": "2 7 11 15\\n9", "output": "0 1"},
      {"input": "1 2 3 4\\n5", "output": "0 3"}
    ]
  }
]`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    let data;
    try {
      data = JSON.parse(input);
      if (!Array.isArray(data)) throw new Error("Input must be a JSON array");
      // Validate testcases
      for (const item of data) {
        if (item.testcases && !Array.isArray(item.testcases)) {
          throw new Error("testcases must be an array");
        }
        if (Array.isArray(item.testcases)) {
          for (const tc of item.testcases) {
            if (!tc.input || !tc.output) {
              throw new Error("Each testcase must have input and output");
            }
          }
        }
      }
    } catch (err) {
      setError("Invalid JSON: " + err.message);
      return;
    }
    setLoading(true);
    try {
      // Use bulkCreate for efficiency
      await problemsAPI.bulkCreate(data);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setInput("");
    } catch (err) {
      setError(err.message || "Failed to upload problems");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-lg transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-lg bg-card border border-border shadow-lg px-8 py-6 text-left relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="mb-4">
          <div className="font-medium text-md mb-1">
            Upload Multiple Problems
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            Paste a JSON array of problem objects. Each object should like the
            example below.
          </div>
          <pre className="bg-muted text-sm rounded p-2 mb-2 overflow-auto whitespace-pre-wrap max-h-[200px]">
            {example}
          </pre>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full min-h-[180px] p-3 text-sm border border-muted focus:outline-none focus:border-border rounded-md font-mono"
            placeholder="Paste JSON array here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            disabled={loading}
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm">
              Problems uploaded successfully!
            </div>
          )}
          <div className="flex flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadMultipleModal;
