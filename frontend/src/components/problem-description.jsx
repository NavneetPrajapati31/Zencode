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
    return (
      <div className="p-4 text-muted-foreground theme-transition">
        No problem data available.
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600/20 text-green-600";
      case "Med.":
      case "Medium":
        return "bg-primary/20 text-primary";
      case "Hard":
        return "bg-red-600/30 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 overflow-y-auto no-scrollbar bg-transparent text-foreground theme-transition">
      {/* Tabs */}
      <div className="w-full theme-transition">
        <div className="theme-transition">
          {/* Problem Title and Solved Status */}
          <div className="flex items-center justify-between mb-4 theme-transition">
            <h1 className="text-xl text-left font-bold theme-transition">
              {problem.title}
            </h1>
            {problem.solved && (
              <span className="text-success flex items-center space-x-1 theme-transition">
                Solved <CheckCircle className="h-5 w-5 theme-transition" />
              </span>
            )}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 theme-transition">
            <span
              className={`text-xs font-medium px-3 py-0.5 rounded-full theme-transition ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty || "Unknown"}
            </span>
            {/* Add more tags if available in problem object */}
          </div>
          {/* Problem Statement */}
          <div className="text-foreground leading-relaxed space-y-4 text-md text-left theme-transition">
            <p className="theme-transition">{problem.description}</p>
            {/* Render examples if available */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4 theme-transition">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="theme-transition">
                    <h3 className="font-semibold text-foreground text-md mb-2 theme-transition">
                      Example {i + 1}:
                    </h3>
                    <div className="bg-muted p-3 rounded-md text-sm theme-transition">
                      <pre className="whitespace-pre-wrap break-words theme-transition">
                        <code className="block theme-transition">
                          Input: {ex.input}
                        </code>
                        <code className="block theme-transition">
                          Output: {ex.output}
                        </code>
                        {ex.explanation && (
                          <code className="block theme-transition">
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
              <div className="space-y-2 theme-transition">
                <h3 className="font-semibold text-foreground text-md theme-transition">
                  Constraints:
                </h3>
                <ul className="list-disc list-inside text-md space-y-1 theme-transition">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="theme-transition">
                      {c}
                    </li>
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
