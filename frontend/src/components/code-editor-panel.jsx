"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism.css";
import {
  Play,
  Send,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORTED_LANGUAGES = [
  {
    name: "C++",
    extension: "cpp",
    prism: "cpp",
    defaultCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello World!\\n";\n  return 0;\n}',
  },
  {
    name: "C",
    extension: "c",
    prism: "c",
    defaultCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello World!\\n");\n  return 0;\n}',
  },
  {
    name: "Python",
    extension: "py",
    prism: "python",
    defaultCode: 'print("Hello World!")',
  },
  {
    name: "JavaScript",
    extension: "js",
    prism: "javascript",
    defaultCode: 'console.log("Hello World!");',
  },
  {
    name: "Java",
    extension: "java",
    prism: "java",
    defaultCode:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
  },
];

const getFileIcon = (lang) => {
  switch (lang) {
    case "c":
      return <FileText className="w-4 h-4 text-primary" />;
    case "cpp":
      return <FileText className="w-4 h-4 text-primary" />;
    case "python":
      return <FileText className="w-4 h-4 text-warning" />;
    case "javascript":
      return <FileText className="w-4 h-4 text-warning" />;
    case "java":
      return <FileText className="w-4 h-4 text-primary" />;
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
};

const compilerAPI = {
  runCode: async ({ language, code, input, problemId, harness }) => {
    const res = await fetch("/compiler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, input, problemId, harness }),
    });
    if (!res.ok) throw new Error("Compiler error");
    return res.json();
  },
};

const extractErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message || "Unknown error";
  if (typeof err === "string") return err;
  if (err.stderr) return err.stderr;
  if (err.error && err.error.stderr) return err.error.stderr;
  if (typeof err === "object" && Object.keys(err).length > 0) {
    return JSON.stringify(err, null, 2);
  }
  return "Unknown error";
};

const CodeEditorPanel = forwardRef(function CodeEditorPanel({ problem }, ref) {
  // --- State ---
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0].prism);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].defaultCode);
  const [activeTab, setActiveTab] = useState("testcases");
  const [activeTestcaseType, setActiveTestcaseType] = useState("public"); // 'public' | 'custom' | 'add'
  const [activeTestcaseIdx, setActiveTestcaseIdx] = useState(0);
  const [customTestcases, setCustomTestcases] = useState([]); // [{input, output, result}]
  const [customInputDraft, setCustomInputDraft] = useState("");
  const [customOutputDraft, setCustomOutputDraft] = useState("");
  const [customEditIdx, setCustomEditIdx] = useState(null);
  const [customEditInput, setCustomEditInput] = useState("");
  const [runResults, setRunResults] = useState([]); // [{input, expected, output, verdict, error}]
  const [submitResults, setSubmitResults] = useState([]); // [{input, expected, output, verdict, error, hidden}]
  const [error, setError] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const editorRootRef = useRef(null);

  // --- Helpers ---
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.prism === language);
  const publicTestcases = problem?.testcases || [];
  const hiddenTestcases = problem?.hiddenTestcases || [];

  // Helper to get the correct problemId string
  const getProblemId = () => problem?._id?.$oid || problem?._id || problem?.id;

  // --- Boilerplate Handling ---
  useEffect(() => {
    if (problem && problem.boilerplate && problem.boilerplate[language]) {
      setCode(problem.boilerplate[language]);
    } else {
      setCode(langObj.defaultCode);
    }
    // eslint-disable-next-line
  }, [problem, language]);

  // --- Cursor Position ---
  const updateCursorPosition = () => {
    if (!editorRootRef.current) return;
    const textarea = editorRootRef.current.querySelector("textarea");
    if (!textarea) return;
    const value = textarea.value;
    const selectionStart = textarea.selectionStart || 0;
    const lines = value.slice(0, selectionStart).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    setCursorPosition({ line, column });
  };
  useEffect(() => {
    setTimeout(() => {
      updateCursorPosition();
    }, 0);
    // eslint-disable-next-line
  }, [code]);

  // --- Run Handler ---
  const handleRun = async () => {
    setRunResults([]);
    setError("");
    const results = [];
    // Run public testcases
    for (let i = 0; i < publicTestcases.length; ++i) {
      const tc = publicTestcases[i];
      try {
        const res = await compilerAPI.runCode({
          language,
          code,
          input: tc.input,
          problemId: getProblemId(),
          harness: problem?.harness?.[language] || "",
        });
        let output = "";
        if (typeof res.output?.stdout === "string" && res.output.stdout) {
          output = res.output.stdout.trim();
        } else if (
          typeof res.output?.stderr === "string" &&
          res.output.stderr
        ) {
          output = res.output.stderr.trim();
        } else if (typeof res.output === "string") {
          output = res.output.trim();
        }
        const expected = (tc.output || "").trim();
        const verdict = output === expected ? "Correct" : "Wrong";
        results.push({
          input: tc.input,
          expected: tc.output,
          output,
          verdict,
          error: null,
        });
      } catch (err) {
        results.push({
          input: tc.input,
          expected: tc.output,
          output: "",
          verdict: "Error",
          error: extractErrorMessage(err),
        });
      }
    }
    setRunResults(results);

    // Run all custom testcases
    if (customTestcases.length > 0) {
      const newCustomTestcases = [...customTestcases];
      for (let i = 0; i < customTestcases.length; ++i) {
        try {
          const res = await compilerAPI.runCode({
            language,
            code,
            input: customTestcases[i].input,
            problemId: getProblemId(),
            harness: problem?.harness?.[language] || "",
          });
          let output = "";
          if (typeof res.output?.stdout === "string" && res.output.stdout) {
            output = res.output.stdout.trim();
          } else if (
            typeof res.output?.stderr === "string" &&
            res.output.stderr
          ) {
            output = res.output.stderr.trim();
          } else if (typeof res.output === "string") {
            output = res.output.trim();
          }
          newCustomTestcases[i].result = {
            output,
            verdict: "Custom",
            error: null,
          };
        } catch (err) {
          newCustomTestcases[i].result = {
            output: "",
            verdict: "Error",
            error: extractErrorMessage(err),
          };
        }
      }
      setCustomTestcases(newCustomTestcases);
    }
  };

  // --- Submit Handler ---
  const handleSubmit = async () => {
    setSubmitResults([]);
    setError("");
    const allTestcases = [
      ...publicTestcases.map((tc) => ({ ...tc, hidden: false })),
      ...hiddenTestcases.map((tc) => ({ ...tc, hidden: true })),
    ];
    const results = [];
    for (let i = 0; i < allTestcases.length; ++i) {
      const tc = allTestcases[i];
      try {
        const res = await compilerAPI.runCode({
          language,
          code,
          input: tc.input,
          problemId: getProblemId(),
          harness: problem?.harness?.[language] || "",
        });
        let output = "";
        if (typeof res.output?.stdout === "string" && res.output.stdout) {
          output = res.output.stdout.trim();
        } else if (
          typeof res.output?.stderr === "string" &&
          res.output.stderr
        ) {
          output = res.output.stderr.trim();
        } else if (typeof res.output === "string") {
          output = res.output.trim();
        }
        const expected = (tc.output || "").trim();
        const verdict = output === expected ? "Passed" : "Failed";
        results.push({
          input: tc.input,
          expected: tc.output,
          output,
          verdict,
          error: null,
          hidden: tc.hidden,
        });
      } catch (err) {
        results.push({
          input: tc.input,
          expected: tc.output,
          output: "",
          verdict: "Error",
          error: extractErrorMessage(err),
          hidden: tc.hidden,
        });
      }
    }
    setSubmitResults(results);
    setActiveTab("submit");
  };

  // --- Language Change ---
  const handleLanguageChange = (prism) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.prism === prism);
    setLanguage(lang.prism);
    setCode(lang.defaultCode);
    setIsDropdownOpen(false);
  };

  // --- Custom Testcase Handlers ---
  const handleAddCustomTestcase = () => {
    if (!customInputDraft.trim()) return;
    setCustomTestcases([
      ...customTestcases,
      { input: customInputDraft, output: customOutputDraft, result: null },
    ]);
    setCustomInputDraft("");
    setCustomOutputDraft("");
    setActiveTestcaseType("custom");
    setActiveTestcaseIdx(customTestcases.length);
  };
  const handleRemoveCustomTestcase = (idx) => {
    const newCustoms = customTestcases.slice();
    newCustoms.splice(idx, 1);
    setCustomTestcases(newCustoms);
    if (activeTestcaseType === "custom") {
      if (activeTestcaseIdx === idx) {
        setActiveTestcaseType("public");
        setActiveTestcaseIdx(0);
      } else if (activeTestcaseIdx > idx) {
        setActiveTestcaseIdx(activeTestcaseIdx - 1);
      }
    }
  };
  const handleEditCustomTestcase = (idx) => {
    setCustomEditIdx(idx);
    setCustomEditInput(customTestcases[idx].input);
  };
  const handleSaveEditCustomTestcase = (idx) => {
    const newCustoms = customTestcases.slice();
    newCustoms[idx].input = customEditInput;
    setCustomTestcases(newCustoms);
    setCustomEditIdx(null);
    setCustomEditInput("");
  };

  useImperativeHandle(ref, () => ({
    run: handleRun,
    submit: handleSubmit,
    getCode: () => code,
  }));

  if (!problem) {
    return (
      <div className="p-4 text-muted-foreground">
        No problem data available.
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="flex flex-col h-full bg-background text-foreground rounded-none theme-transition">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border theme-transition">
        <div className="flex items-center space-x-2 theme-transition">
          {getFileIcon(language)}
          <span className="font-medium text-muted-foreground text-sm theme-transition">
            {problem.title || "Code"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="text-muted-foreground hover:bg-muted px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm theme-transition"
              aria-label="Select language"
              tabIndex={0}
              onClick={() => setIsDropdownOpen((v) => !v)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsDropdownOpen((v) => !v)
              }
            >
              <span className="theme-transition">{langObj.name}</span>
              <ChevronDown className="h-4 w-4 theme-transition" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border text-sm text-foreground rounded-md shadow-none z-10 min-w-[120px] theme-transition">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.prism}
                    onClick={() => handleLanguageChange(lang.prism)}
                    className="block w-full text-left px-4 py-2 hover:bg-muted theme-transition"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0 theme-transition">
        <div className="flex-1 relative bg-background border-b border-border theme-transition">
          <div className="absolute inset-0 flex h-full overflow-y-auto no-scrollbar">
            <div className="flex w-full h-full">
              {/* Line Numbers */}
              <div className="w-auto px-2 h-full flex flex-col text-right text-sm text-muted-foreground py-[14px] select-none theme-transition">
                {Array.from({ length: code.split("\n").length || 1 }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="h-6 flex items-center justify-end pr-3"
                      style={{ lineHeight: "1.5rem" }}
                    >
                      {i + 1}
                    </div>
                  )
                )}
              </div>
              {/* Code Area */}
              <div className="flex-1 relative min-w-0 h-full theme-transition">
                <div className="p-1 font-mono text-md leading-6 min-h-full text-foreground theme-transition">
                  <div ref={editorRootRef} className="h-full theme-transition">
                    <Editor
                      value={code}
                      onValueChange={setCode}
                      highlight={(c) =>
                        highlight(c, languages[language] || languages.clike)
                      }
                      padding={10}
                      textareaId="codeArea"
                      textareaClassName="outline-none bg-transparent w-full h-full theme-transition"
                      className="min-h-full bg-transparent text-foreground theme-transition"
                      aria-label="Code editor"
                      tabIndex={0}
                      onClick={updateCursorPosition}
                      onKeyUp={updateCursorPosition}
                      onSelect={updateCursorPosition}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Status Bar */}
        <div className="h-8 flex items-center justify-end px-4 text-xs text-muted-foreground theme-transition">
          <span className="theme-transition">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-background border-t border-border px-4 py-4 h-1/2 overflow-y-auto no-scrollbar theme-transition">
        {activeTab === "testcases" && (
          <div>
            {/* Testcase Tabs */}
            <div className="flex items-center space-x-2 mb-4 theme-transition">
              {publicTestcases.map((tc, idx) => (
                <button
                  key={idx}
                  className={`text-sm px-5 py-1 rounded font-medium transition-colors duration-150 focus:outline-none hover:cursor-pointer theme-transition ${activeTestcaseType === "public" && activeTestcaseIdx === idx ? "bg-muted text-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                  onClick={() => {
                    setActiveTestcaseType("public");
                    setActiveTestcaseIdx(idx);
                  }}
                  tabIndex={0}
                  aria-label={`Testcase ${idx + 1}`}
                >
                  Case {idx + 1}
                </button>
              ))}
              {customTestcases.map((tc, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center theme-transition"
                >
                  <button
                    className={`text-sm px-4 py-1 rounded font-medium transition-colors duration-150 focus:outline-none hover:cursor-pointer theme-transition ${activeTestcaseType === "custom" && activeTestcaseIdx === idx ? "bg-muted text-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                    onClick={() => {
                      setActiveTestcaseType("custom");
                      setActiveTestcaseIdx(idx);
                    }}
                    tabIndex={0}
                    aria-label={`Custom Testcase ${idx + 1}`}
                  >
                    Custom {idx + 1}
                  </button>
                  <button
                    className="absolute -right-1.5 -top-2 text-muted-foreground bg-muted rounded-full px-1.5 hover:cursor-pointer text-sm theme-transition"
                    onClick={() => handleRemoveCustomTestcase(idx)}
                    aria-label="Remove custom testcase"
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Add (+) tab */}
              <button
                className={`text-sm px-3 py-1 rounded font-bold bg-card text-muted-foreground hover:bg-muted focus:outline-none theme-transition`}
                onClick={() => {
                  setActiveTestcaseType("add");
                  setActiveTestcaseIdx(-1);
                }}
                tabIndex={0}
                aria-label="Add custom testcase"
              >
                +
              </button>
            </div>
            {/* Testcase Details */}
            {activeTestcaseType === "public" &&
            publicTestcases[activeTestcaseIdx] ? (
              <div className="space-y-3 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground text-sm theme-transition">
                    Input:
                  </span>
                  <div className="bg-muted rounded p-2 mt-1 font-mono text-xs whitespace-pre-wrap text-left min-h-8 theme-transition">
                    {publicTestcases[activeTestcaseIdx].input}
                  </div>
                </div>
                <div className="theme-transition">
                  <span className="text-muted-foreground text-sm theme-transition">
                    Expected Output:
                  </span>
                  <div className="bg-muted rounded p-2 mt-1 font-mono text-xs whitespace-pre-wrap theme-transition">
                    {publicTestcases[activeTestcaseIdx].output}
                  </div>
                </div>
                {/* {publicTestcases[activeTestcaseIdx].explanation && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">Explanation:</span>{" "}
                    {publicTestcases[activeTestcaseIdx].explanation}
                  </div>
                )} */}
                {/* Show run result for this testcase if available */}
                {runResults[activeTestcaseIdx] && (
                  <div className="space-y-1 theme-transition">
                    <div className="theme-transition">
                      <span className="text-muted-foreground text-sm theme-transition">
                        Your Output:
                      </span>
                      <div className="bg-muted rounded p-2 mt-1 font-mono text-xs whitespace-pre-wrap min-h-8 theme-transition">
                        {runResults[activeTestcaseIdx].output}
                      </div>
                    </div>
                    <div className="theme-transition">
                      <span className="text-muted-foreground text-sm theme-transition">
                        Verdict:
                      </span>
                      <span
                        className={`ml-2 font-semibold text-sm theme-transition ${runResults[activeTestcaseIdx].verdict === "Correct" ? "text-green-500" : runResults[activeTestcaseIdx].verdict === "Wrong" ? "text-destructive" : "text-warning"}`}
                      >
                        {runResults[activeTestcaseIdx].verdict}
                      </span>
                    </div>
                    {runResults[activeTestcaseIdx].error && (
                      <div className="text-xs text-destructive mt-1 theme-transition">
                        Error: {runResults[activeTestcaseIdx].error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            {activeTestcaseType === "custom" &&
            customTestcases[activeTestcaseIdx] ? (
              <div className="space-y-3 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground theme-transition">
                    Input:
                  </span>
                  {customEditIdx === activeTestcaseIdx ? (
                    <textarea
                      className="w-full min-h-[60px] bg-muted text-foreground rounded p-2 font-mono text-xs border border-border focus:outline-none focus:ring-2 focus:ring-primary theme-transition"
                      value={customEditInput}
                      onChange={(e) => setCustomEditInput(e.target.value)}
                    />
                  ) : (
                    <div className="bg-muted rounded p-2 mt-1 font-mono text-xs whitespace-pre-wrap min-h-8 theme-transition">
                      {customTestcases[activeTestcaseIdx].input}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 theme-transition">
                  {customEditIdx === activeTestcaseIdx ? (
                    <>
                      <button
                        className="px-3 py-1 rounded bg-primary/20 text-primary text-xs theme-transition"
                        onClick={() =>
                          handleSaveEditCustomTestcase(activeTestcaseIdx)
                        }
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs theme-transition"
                        onClick={() => setCustomEditIdx(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs hover:cursor-pointer theme-transition"
                      onClick={() =>
                        handleEditCustomTestcase(activeTestcaseIdx)
                      }
                    >
                      Edit
                    </button>
                  )}
                </div>
                {/* Show run result for this custom testcase if available */}
                {customTestcases[activeTestcaseIdx].result && (
                  <div className="space-y-1">
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Your Output:
                      </span>
                      <div className="bg-muted rounded p-2 mt-1 font-mono text-xs whitespace-pre-wrap min-h-8">
                        {customTestcases[activeTestcaseIdx].result.output}
                      </div>
                    </div>
                    {customTestcases[activeTestcaseIdx].result.error && (
                      <div className="text-xs text-destructive mt-1">
                        Error: {customTestcases[activeTestcaseIdx].result.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            {activeTestcaseType === "add" && (
              <div className="space-y-3 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground text-sm theme-transition">
                    Input:
                  </span>
                  <textarea
                    className="w-full min-h-[60px] bg-muted text-muted-foreground rounded p-2 font-mono text-sm border border-border focus:outline-none mt-2 theme-transition"
                    value={customInputDraft}
                    onChange={(e) => setCustomInputDraft(e.target.value)}
                    placeholder="Enter custom input..."
                  />
                </div>
                <button
                  className="px-4 py-1 rounded bg-primary/20 text-primary text-xs hover:cursor-pointer theme-transition"
                  onClick={handleAddCustomTestcase}
                  disabled={!customInputDraft.trim()}
                >
                  Add Testcase
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "custom" && (
          <div className="theme-transition">
            <label
              htmlFor="custom-input"
              className="block text-xs text-muted-foreground mb-1 theme-transition"
            >
              Custom Input (stdin):
            </label>
            <textarea
              id="custom-input"
              className="w-full min-h-[60px] bg-muted text-foreground rounded p-2 font-mono text-xs border border-border focus:outline-none focus:ring-2 focus:ring-primary theme-transition"
              value={customInputDraft}
              onChange={(e) => setCustomInputDraft(e.target.value)}
              aria-label="Custom input"
            />
            <div className="text-xs text-muted-foreground mt-1 theme-transition">
              This input will be included in the next Run.
            </div>
          </div>
        )}
        {activeTab === "output" && (
          <div className="theme-transition">
            <div className="text-xs text-muted-foreground mb-2 theme-transition">
              Last Run Output:
            </div>
            <pre className="bg-muted text-foreground font-mono text-xs rounded p-4 whitespace-pre-wrap max-h-60 overflow-y-auto border border-border theme-transition">
              {runResults.length > 0
                ? runResults
                    .map(
                      (r, i) =>
                        `#${r.verdict === "Custom" ? "Custom" : i + 1}\nInput:\n${r.input}\nOutput:\n${r.output}\n${r.expected ? `Expected:\n${r.expected}\nVerdict: ${r.verdict}` : ""}\n${r.error ? `Error: ${r.error}` : ""}\n\n`
                    )
                    .join("")
                : "No output yet. Click Run to test your code."}
            </pre>
          </div>
        )}
        {activeTab === "submit" && (
          <div className="theme-transition">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-border rounded text-foreground theme-transition">
                <thead>
                  <tr className="bg-muted text-foreground theme-transition">
                    <th className="px-2 py-1 text-left theme-transition">#</th>
                    <th className="px-2 py-1 text-left theme-transition">
                      Input
                    </th>
                    <th className="px-2 py-1 text-left theme-transition">
                      Expected
                    </th>
                    <th className="px-2 py-1 text-left theme-transition">
                      Output
                    </th>
                    <th className="px-2 py-1 text-left theme-transition">
                      Verdict
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submitResults.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted-foreground py-4 theme-transition"
                      >
                        No submission yet. Click Submit to judge your code.
                      </td>
                    </tr>
                  )}
                  {submitResults.map((res, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-border theme-transition"
                    >
                      <td className="px-2 py-1 theme-transition">
                        {res.hidden ? (
                          <span className="italic text-muted-foreground theme-transition">
                            Hidden
                          </span>
                        ) : (
                          idx +
                          1 -
                          submitResults.slice(0, idx).filter((r) => r.hidden)
                            .length
                        )}
                      </td>
                      <td className="px-2 py-1 whitespace-pre-wrap max-w-xs theme-transition">
                        {res.hidden ? (
                          <span className="italic text-muted-foreground theme-transition">
                            Hidden
                          </span>
                        ) : (
                          res.input
                        )}
                      </td>
                      <td className="px-2 py-1 whitespace-pre-wrap max-w-xs theme-transition">
                        {res.hidden ? (
                          <span className="italic text-muted-foreground theme-transition">
                            Hidden
                          </span>
                        ) : (
                          res.expected
                        )}
                      </td>
                      <td className="px-2 py-1 whitespace-pre-wrap max-w-xs theme-transition">
                        {res.output}
                      </td>
                      <td className="px-2 py-1 theme-transition">
                        {res.verdict === "Passed" && (
                          <span className="text-green-500 flex items-center theme-transition">
                            <CheckCircle2 className="w-4 h-4 mr-1 theme-transition" />
                            Passed
                          </span>
                        )}
                        {res.verdict === "Failed" && (
                          <span className="text-destructive flex items-center theme-transition">
                            <XCircle className="w-4 h-4 mr-1 theme-transition" />
                            Failed
                          </span>
                        )}
                        {res.verdict === "Error" && (
                          <span className="text-warning theme-transition">
                            Error
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {submitResults.length > 0 && (
              <div className="mt-2 text-xs theme-transition">
                <span className="font-semibold theme-transition">Summary:</span>{" "}
                {submitResults.filter((r) => r.verdict === "Passed").length} /{" "}
                {submitResults.length} testcases passed.
                {submitResults.every((r) => r.verdict === "Passed") && (
                  <span className="ml-2 text-success font-semibold theme-transition">
                    Accepted!
                  </span>
                )}
                {submitResults.some(
                  (r) => r.verdict === "Failed" || r.verdict === "Error"
                ) && (
                  <span className="ml-2 text-destructive font-semibold theme-transition">
                    Not Accepted
                  </span>
                )}
              </div>
            )}
            {submitResults.some((r) => r.error) && (
              <div className="mt-2 text-destructive text-xs theme-transition">
                {submitResults
                  .filter((r) => r.error)
                  .map((r, i) => (
                    <div key={i} className="mb-1 theme-transition">
                      <b>Error:</b> {r.error}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-2 text-destructive text-xs theme-transition">
            {error}
          </div>
        )}
      </div>
    </div>
  );
});

export default CodeEditorPanel;
