"use client";

import {
  CheckCircle,
  BookOpen,
  FlaskConical,
  FileText,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Share2,
  HelpCircle,
} from "lucide-react";

export default function ProblemDescription({ problem }) {
  if (!problem) {
    return <div className="p-4 text-zinc-300">No problem data available.</div>;
  }
  return (
    <div className="p-4 overflow-y-auto bg-slate-900 text-slate-400">
      {/* Tabs */}
      <div className="w-full">
        <div>
          {/* Problem Title and Solved Status */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-left font-bold text-slate-400">
              {problem.title}
            </h1>
            {problem.solved && (
              <span className="text-green-500 flex items-center space-x-1">
                Solved <CheckCircle className="h-5 w-5" />
              </span>
            )}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-green-600/20 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {problem.difficulty || "Unknown"}
            </span>
            {/* Add more tags if available in problem object */}
          </div>
          {/* Problem Statement */}
          <div className="text-slate-400 leading-relaxed space-y-4 text-sm text-left">
            <p>{problem.description}</p>
            {/* Render examples if available */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4">
                {problem.examples.map((ex, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-zinc-100 mb-1">
                      Example {i + 1}:
                    </h3>
                    <div className="bg-zinc-700 p-3 rounded-md text-xs">
                      <pre>
                        <code className="block">Input: {ex.input}</code>
                        <code className="block">Output: {ex.output}</code>
                        {ex.explanation && (
                          <code className="block">
                            Explanation: {ex.explanation}
                          </code>
                        )}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-100">Constraints:</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
