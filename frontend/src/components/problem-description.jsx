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
      <div className="p-4 text-muted-foreground">
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
    <div className="p-4 overflow-y-auto bg-background text-foreground">
      {/* Tabs */}
      <div className="w-full">
        <div>
          {/* Problem Title and Solved Status */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-left font-bold">{problem.title}</h1>
            {problem.solved && (
              <span className="text-success flex items-center space-x-1">
                Solved <CheckCircle className="h-5 w-5" />
              </span>
            )}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className={`text-xs font-medium px-3 py-0.5 rounded-full ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty || "Unknown"}
            </span>
            {/* Add more tags if available in problem object */}
          </div>
          {/* Problem Statement */}
          <div className="text-foreground leading-relaxed space-y-4 text-md text-left">
            <p>{problem.description}</p>
            {/* Render examples if available */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4">
                {problem.examples.map((ex, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground text-md mb-2">
                      Example {i + 1}:
                    </h3>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      <pre className="whitespace-pre-wrap break-words">
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
                <h3 className="font-semibold text-foreground text-md">
                  Constraints:
                </h3>
                <ul className="list-disc list-inside text-md space-y-1">
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
