import { useEffect, useState } from "react";
import { submissionsAPI } from "@/utils/api";

const languageBadge = (lang) => {
  if (!lang) return null;
  return (
    <span className="ml-4 px-3 py-1 rounded-full bg-popover text-xs text-muted-foreground font-medium theme-transition">
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
        <div className="text-muted-foreground">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-muted-foreground">No submissions yet.</div>
      ) : (
        <ul className="divide-y divide-border overflow-y-auto no-scrollbar space-y-2 theme-transition">
          {[...submissions]
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .map((sub, idx) => (
              <li
                key={sub._id || idx}
                className="px-4 py-3 flex items-center justify-between bg-accent rounded-lg shadow-none border border-border theme-transition"
              >
                <div className="flex items-center gap-4 theme-transition">
                  {/* <span className="text-muted-foreground w-6 text-right mr-2">
                  {idx + 1}
                </span> */}
                  <div className="flex flex-col theme-transition">
                    <span
                      className={`font-semibold text-sm text-left ${sub.verdict === "Accepted" ? "text-green-500" : "text-destructive"} theme-transition`}
                    >
                      {sub.verdict}
                    </span>
                    <span className="text-xs text-muted-foreground text-left mt-1 theme-transition">
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
