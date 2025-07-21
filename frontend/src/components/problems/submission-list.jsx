import { useEffect, useState, useCallback } from "react";
import { submissionsAPI } from "@/utils/api";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import { ChevronLeft } from "lucide-react";

const languageBadge = (lang) => {
  if (!lang) return null;
  return (
    <span className="ml-4 px-3 py-1 rounded-full bg-popover text-sm text-muted-foreground font-medium theme-transition">
      {lang}
    </span>
  );
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export default function SubmissionList({ problemId, refreshKey }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleSelect = useCallback(
    (id) => setSelectedId((cur) => (cur === id ? null : id)),
    []
  );

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await submissionsAPI.getByProblemId(problemId);
      setSubmissions(data);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) fetchSubmissions();
    // eslint-disable-next-line
  }, [problemId, refreshKey]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex flex-1 min-h-[50vh] w-full items-center justify-center py-4 px-6 gap-2">
          <span className="text-muted-foreground text-sm">
            Loading submissions...
          </span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-1 min-h-[50vh] w-full items-center justify-center py-4 px-6 gap-2">
          <span className="text-muted-foreground text-sm">
            No recent submissions
          </span>
        </div>
      ) : selectedId ? (
        <div className="bg-card border border-border rounded-lg p-0 overflow-x-auto no-scrollbar h-full max-h-[78vh] theme-transition">
          <div
            className="sticky top-0 z-10 w-full h-10 rounded-t-2xl bg-card flex items-center justify-between px-6 border-b border-border theme-transition"
            aria-label="Window controls"
            tabIndex={0}
          >
            <div
              className="flex space-x-2 cursor-pointer"
              onClick={() => {
                setSelectedId(null);
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-red-500 theme-transition"
                aria-label="Close"
              />
              <span
                className="w-2 h-2 rounded-full bg-yellow-500 theme-transition"
                aria-label="Minimize"
              />
              <span
                className="w-2 h-2 rounded-full bg-green-500 theme-transition"
                aria-label="Maximize"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              Submitted Code
            </span>
          </div>
          <Editor
            value={
              submissions.find((s) => (s._id || s.idx) === selectedId)?.code ||
              "No code available."
            }
            onValueChange={() => {}}
            highlight={(code) => {
              // Try to detect language from submission, fallback to cpp
              const sub = submissions.find(
                (s) => (s._id || s.idx) === selectedId
              );
              const lang = (
                sub?.language ||
                sub?.lang ||
                sub?.codeLanguage ||
                "cpp"
              ).toLowerCase();
              return highlight(code, languages[lang] || languages.cpp);
            }}
            padding={12}
            readOnly
            textareaId="submissionCodeView"
            textareaClassName="outline-none bg-transparent w-full h-full theme-transition cursor-default"
            className="h-full overflow-auto no-scrollbar bg-background text-foreground font-mono text-xs rounded theme-transition outline-none border-none"
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              background: "none",
              padding: 12,
            }}
          />
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-y-auto no-scrollbar space-y-2 theme-transition">
          {[...submissions]
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .map((sub, idx) => (
              <li
                key={sub._id || idx}
                className={`px-4 py-3 flex items-center justify-between bg-accent rounded-lg shadow-none border border-border theme-transition cursor-pointer ${selectedId === (sub._id || idx) ? "ring-0" : ""}`}
                onClick={() => handleSelect(sub._id || idx)}
                tabIndex={0}
                aria-label="View submission code"
              >
                <div className="flex items-center gap-4 theme-transition">
                  <div className="flex flex-col theme-transition">
                    <span
                      className={`font-medium text-md text-left ${sub.verdict === "Accepted" ? "text-green-500" : "text-red-500"} theme-transition`}
                    >
                      {sub.verdict}
                    </span>
                    <span className="text-sm text-muted-foreground text-left mt-1 theme-transition">
                      {formatDate(sub.submittedAt)}
                    </span>
                  </div>
                </div>
                {languageBadge(
                  capitalize(
                    sub.language || sub.lang || sub.codeLanguage || "C++"
                  )
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
