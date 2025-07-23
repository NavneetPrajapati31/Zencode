"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import MonacoEditor from "@monaco-editor/react";
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
import { submissionsAPI } from "@/utils/api";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import nightOwlTheme from "./Night Owl.json";
import { useTheme } from "@/components/theme-context-utils";

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
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok || data.success === false) {
      // Try to extract the most detailed error message
      let errorMsg =
        (data &&
          (data.error?.stderr ||
            data.error?.message ||
            data.error ||
            data.message)) ||
        "Compiler error";
      throw new Error(errorMsg);
    }
    return data;
  },
};

// Remove absolute file paths from error messages, keep function names and error details
const sanitizeErrorMessage = (msg) => {
  if (!msg || typeof msg !== "string") return msg;
  // Remove Windows and Unix file paths (e.g., C:\...\file.cpp: or /home/user/file.cpp:)
  // Keep only the filename and error message
  return msg
    .replace(/([A-Za-z]:)?[\\/][^:]+[\\/]([\w.-]+\.\w+):/g, "$2:")
    .replace(/([\\/][^:]+)+[\\/]([\w.-]+\.\w+):/g, "$2:");
};

const extractErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (err instanceof Error)
    return sanitizeErrorMessage(err.message || "Unknown error");
  if (typeof err === "string") return sanitizeErrorMessage(err);
  if (err.stderr) return sanitizeErrorMessage(err.stderr);
  if (err.error && err.error.stderr)
    return sanitizeErrorMessage(err.error.stderr);
  if (err.error && typeof err.error === "string")
    return sanitizeErrorMessage(err.error);
  if (err.message) return sanitizeErrorMessage(err.message);
  if (typeof err === "object" && Object.keys(err).length > 0) {
    return sanitizeErrorMessage(JSON.stringify(err, null, 2));
  }
  return "Unknown error";
};

const nightOwlLightTheme = {
  ...nightOwlTheme,
  base: "vs",
  inherit: true,
  rules: [{ background: "f9f9fa", token: "" }, ...nightOwlTheme.rules],
  colors: {
    ...nightOwlTheme.colors,
    "editor.foreground": "#000000",
    "editor.background": "#ffffff", // oklch(98.5% 0 0)
    "editor.lineHighlightBackground": "#e5e7eb",
    "editor.selectionBackground": "#e0e7ef",
    "editorSuggestWidget.background": "#3b82f6",
    "editorSuggestWidget.foreground": "#d6deeb",
    "editorSuggestWidget.selectedBackground": "#050505",
    "editorSuggestWidget.highlightForeground": "#f59e42",
    "editorSuggestWidget.border": "#050505",
  },
};

const CodeEditorPanel = forwardRef(function CodeEditorPanel(
  { problem, onSubmissionCreated },
  ref
) {
  const { theme, isInitialized } = useTheme();
  // --- State ---
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0].prism);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].defaultCode);
  const [userEdited, setUserEdited] = useState(false);
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
  // Removed isDropdownOpen, now handled by Shadcn Select
  const editorRootRef = useRef(null);
  // --- Vertical Resizer State/Logic ---
  const [topPanelHeight, setTopPanelHeight] = useState(50); // percent
  const [isVResizing, setIsVResizing] = useState(false);
  const vDividerRef = useRef(null);
  useEffect(() => {
    if (!isVResizing) return;
    const handleMouseMove = (e) => {
      const container = vDividerRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percent = (y / rect.height) * 100;
      const clamped = Math.max(20, Math.min(80, percent));
      setTopPanelHeight(clamped);
    };
    const handleMouseUp = () => setIsVResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVResizing]);

  // --- Helpers ---
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.prism === language);
  const publicTestcases = problem?.testcases || [];
  const hiddenTestcases = problem?.hiddenTestcases || [];

  // Helper to get the correct problemId string
  const getProblemId = () => problem?._id?.$oid || problem?._id || problem?.id;

  // Helper to display input/output with real newlines
  const displayWithNewlines = (str) =>
    typeof str === "string" ? str.replace(/\\n/g, "\n") : str;

  // --- Boilerplate Handling ---
  useEffect(() => {
    setUserEdited(false);
  }, [problem]);
  useEffect(() => {
    if (!userEdited) {
      if (problem && problem.boilerplate && problem.boilerplate[language]) {
        setCode(problem.boilerplate[language]);
      } else {
        setCode(langObj.defaultCode);
      }
    }
    // eslint-disable-next-line
  }, [problem, language]);

  // Mark as user-edited if code changes (but not on initial set)
  useEffect(() => {
    if (code !== (problem?.boilerplate?.[language] || langObj.defaultCode)) {
      setUserEdited(true);
    }
    // eslint-disable-next-line
  }, [code]);

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

    // Also run all public testcases and update runResults
    const newRunResults = [];
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
        newRunResults.push({
          input: tc.input,
          expected: tc.output,
          output,
          verdict,
          error: null,
        });
      } catch (err) {
        newRunResults.push({
          input: tc.input,
          expected: tc.output,
          output: "",
          verdict: "Error",
          error: extractErrorMessage(err),
        });
      }
    }
    setRunResults(newRunResults);

    // Also run all custom testcases and update their results
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

    // Switch to Results tab to show complete submission results
    setActiveTab("submit");

    // --- Create submission in backend ---
    try {
      const verdict = results.every((r) => r.verdict === "Passed")
        ? "Accepted"
        : "Not Accepted";
      await submissionsAPI.create({
        problemId: getProblemId(),
        verdict,
        language,
        code,
      });
      if (onSubmissionCreated) onSubmissionCreated();
    } catch (err) {
      // Optionally handle error
      console.error("Failed to save submission:", err);
    }
  };

  // --- Language Change ---
  const handleLanguageChange = (prism) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.prism === prism);
    setLanguage(lang.prism);
    setUserEdited(false);
    // setCode will be handled by useEffect
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

  // Add useEffect to update Monaco theme on theme change
  useEffect(() => {
    if (window.monaco) {
      window.monaco.editor.setTheme(
        theme === "dark" ? "night-owl" : "night-owl-light"
      );
    }
  }, [theme]);

  if (!problem) {
    return (
      <div className="p-4 text-muted-foreground">
        No problem data available.
      </div>
    );
  }

  if (!isInitialized) {
    return null;
    // Or, to show a spinner:
    // return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
  }

  // --- UI ---
  return (
    <div className="flex flex-col h-full bg-background text-foreground rounded-none theme-transition">
      {/* Top Coding Panel: Header + Editor */}
      <div
        style={{ height: `${topPanelHeight}%`, minHeight: "120px" }}
        className="flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-2 border-b border-border theme-transition space-x-3">
          <div className="flex-1 min-w-0 flex items-center space-x-2 theme-transition">
            {getFileIcon(language)}
            <span className="font-medium truncate text-muted-foreground text-sm theme-transition">
              {problem.title || "Code"}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto" aria-label="Select language">
                <SelectValue>{langObj.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.prism} value={lang.prism}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 flex flex-col theme-transition h-full">
          <div className="flex-1 relative bg-background border-none theme-transition h-full">
            <div className="absolute inset-0 flex h-full overflow-y-auto no-scrollbar theme-transition">
              <div className="flex w-full h-full theme-transition">
                {/* Monaco Editor Area (no custom line numbers) */}
                <div className="flex-1 relative min-w-0 h-full theme-transition">
                  <div className="p-1 font-mono text-md leading-6 min-h-full text-foreground theme-transition h-full">
                    <MonacoEditor
                      className="bg-background theme-transition"
                      wrapperProps={{
                        className: "bg-background theme-transition",
                      }}
                      height="100%"
                      width="100%"
                      language={language === "cpp" ? "cpp" : language}
                      value={code}
                      key={theme}
                      theme={theme === "dark" ? "night-owl" : "night-owl-light"}
                      options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        fontFamily:
                          "Fira Mono, Menlo, Monaco, Consolas, monospace",
                        lineNumbers: "on",
                        automaticLayout: true,
                        tabSize: 2,
                        renderLineHighlight: "all",
                        scrollbar: { vertical: "auto", horizontal: "auto" },
                        fixedOverflowWidgets: true,
                        smoothScrolling: true,
                        cursorBlinking: "blink",
                        cursorSmoothCaretAnimation: true,
                        ariaLabel: "Code editor",
                      }}
                      onChange={(val) => {
                        setCode(val || "");
                        setUserEdited(true);
                      }}
                      onMount={(editor) => {
                        try {
                          // Debug: log the theme object
                          console.log(
                            "[Monaco] Registering theme night-owl:",
                            nightOwlTheme
                          );
                          if (window.monaco) {
                            window.monaco.editor.defineTheme(
                              "night-owl",
                              nightOwlTheme
                            );
                            window.monaco.editor.defineTheme(
                              "night-owl-light",
                              nightOwlLightTheme
                            );
                            // Force set theme on mount
                            window.monaco.editor.setTheme(
                              theme === "dark" ? "night-owl" : "night-owl-light"
                            );
                          } else {
                            console.warn(
                              "[Monaco] window.monaco not available!"
                            );
                          }
                        } catch (err) {
                          console.error(
                            "[Monaco] Error registering theme night-owl:",
                            err
                          );
                        }
                        editor.focus();
                        editor.onDidChangeCursorPosition((e) => {
                          const pos = e.position;
                          setCursorPosition({
                            line: pos.lineNumber,
                            column: pos.column,
                          });
                        });
                      }}
                    />
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
      </div>
      {/* Vertical Resizer Divider */}
      <div
        ref={vDividerRef}
        className={`bg-border cursor-row-resize relative theme-transition transition-all duration-200 ${isVResizing ? "h-[4px]" : "h-[1px]"} hover:h-[4px] w-full`}
        onMouseDown={() => setIsVResizing(true)}
        style={{ cursor: isVResizing ? "row-resize" : "row-resize" }}
      >
        <div className="absolute inset-x-0 -top-1 -bottom-1 bg-transparent" />
      </div>
      {/* Tab Content Panel */}
      <div
        style={{ height: `${100 - topPanelHeight}%`, minHeight: "120px" }}
        className="flex-1 flex flex-col"
      >
        {/* Tab Triggers for Custom and Output */}
        <div className="h-10 flex items-center w-full border-b-2 border-border space-x-0 mb-4 theme-transition">
          <button
            className={`w-1/2 h-10 text-sm px-5 py-1 rounded-none font-medium transition-colors duration-150 focus:outline-none hover:cursor-pointer theme-transition  border-r border-border  ${activeTab === "testcases" ? "bg-accent text-foreground" : "bg-card text-muted-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("testcases")}
            tabIndex={0}
            aria-label="Testcases Tab"
          >
            Testcases
          </button>
          <button
            className={`w-1/2 h-10 text-sm px-5 py-1 rounded-none font-medium transition-colors duration-150 focus:outline-none hover:cursor-pointer theme-transition ${activeTab === "submit" ? "bg-accent text-foreground" : "bg-card text-muted-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("submit")}
            tabIndex={0}
            aria-label="Submit Tab"
          >
            Results
          </button>
        </div>
        {activeTab === "testcases" && (
          <div className="px-4">
            {/* Testcase Tabs */}
            <div className="flex min-w-full overflow-y-auto items-center space-x-2 mb-4 theme-transition">
              {publicTestcases.map((tc, idx) => (
                <button
                  key={idx}
                  className={`text-sm px-5 py-1 min-w-[100px] rounded font-medium transition-colors duration-150 focus:outline-none hover:cursor-pointer theme-transition ${activeTestcaseType === "public" && activeTestcaseIdx === idx ? "bg-accent text-foreground" : "bg-card text-muted-foreground hover:bg-accent"}`}
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
                    className="absolute -right-2 -top-2.5 text-muted-foreground bg-accent rounded-full px-1.5 hover:cursor-pointer text-sm theme-transition border border-border"
                    onClick={() => handleRemoveCustomTestcase(idx)}
                    aria-label="Remove custom testcase"
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Add (+) tab */}
              <button
                className={`text-sm px-4 py-1.5 rounded font-bold bg-card text-muted-foreground hover:bg-muted focus:outline-none theme-transition`}
                onClick={() => {
                  setActiveTestcaseType("add");
                  setActiveTestcaseIdx(-1);
                }}
                tabIndex={0}
                aria-label="Add custom testcase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {/* Testcase Details */}
            {activeTestcaseType === "public" &&
            publicTestcases[activeTestcaseIdx] ? (
              <div className="space-y-3 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground text-md theme-transition">
                    Input:
                  </span>
                  <div className="bg-muted rounded p-2 mt-1 font-mono text-md whitespace-pre-wrap text-left min-h-8 theme-transition">
                    {displayWithNewlines(
                      publicTestcases[activeTestcaseIdx].input
                    )}
                  </div>
                </div>
                <div className="theme-transition">
                  <span className="text-muted-foreground text-md theme-transition">
                    Expected Output:
                  </span>
                  <div className="bg-muted rounded p-2 mt-1 font-mono text-md whitespace-pre-wrap theme-transition">
                    {displayWithNewlines(
                      publicTestcases[activeTestcaseIdx].output
                    )}
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
                      <span className="text-muted-foreground text-md theme-transition">
                        Your Output:
                      </span>
                      <div className="bg-muted rounded p-2 mt-1 mb-2 font-mono text-md whitespace-pre-wrap min-h-8 theme-transition">
                        {runResults[activeTestcaseIdx].output}
                      </div>
                    </div>
                    <div className="theme-transition">
                      <span className="text-muted-foreground text-md theme-transition">
                        Verdict:
                      </span>
                      <span
                        className={`ml-2 text-md theme-transition ${runResults[activeTestcaseIdx].verdict === "Correct" ? "text-green-500" : runResults[activeTestcaseIdx].verdict === "Wrong" ? "text-destructive" : "text-destructive"}`}
                      >
                        {runResults[activeTestcaseIdx].verdict}
                      </span>
                    </div>
                    {runResults[activeTestcaseIdx].error && (
                      <div className="text-md text-destructive bg-destructive/10 p-4 mt-2 rounded-lg theme-transition">
                        Error: {runResults[activeTestcaseIdx].error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            {activeTestcaseType === "custom" &&
            customTestcases[activeTestcaseIdx] ? (
              <div className="space-y-2 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground theme-transition">
                    Input:
                  </span>
                  {customEditIdx === activeTestcaseIdx ? (
                    <textarea
                      className="w-full min-h-[60px] bg-muted text-foreground rounded p-2 font-mono text-md border border-border focus:outline-none focus:ring-0 theme-transition mt-2"
                      value={customEditInput}
                      onChange={(e) => setCustomEditInput(e.target.value)}
                    />
                  ) : (
                    <div className="bg-muted rounded p-2 mt-1 font-mono text-md whitespace-pre-wrap min-h-8 theme-transition">
                      {displayWithNewlines(
                        customTestcases[activeTestcaseIdx].input
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 theme-transition">
                  {customEditIdx === activeTestcaseIdx ? (
                    <>
                      <button
                        className="px-3 py-1 rounded bg-primary/20 text-primary text-sm theme-transition"
                        onClick={() =>
                          handleSaveEditCustomTestcase(activeTestcaseIdx)
                        }
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-muted text-muted-foreground text-sm theme-transition"
                        onClick={() => setCustomEditIdx(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-3 py-1 rounded bg-muted text-muted-foreground text-sm hover:cursor-pointer theme-transition"
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
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground text-md">
                        Your Output:
                      </span>
                      <div className="bg-muted rounded p-2 mt-1 font-mono text-md whitespace-pre-wrap min-h-8">
                        {displayWithNewlines(
                          customTestcases[activeTestcaseIdx].result.output
                        )}
                      </div>
                    </div>
                    {customTestcases[activeTestcaseIdx].result.error && (
                      <div className="text-md text-destructive mt-1">
                        Error: {customTestcases[activeTestcaseIdx].result.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            {activeTestcaseType === "add" && (
              <div className="space-y-2 text-left theme-transition">
                <div className="theme-transition">
                  <span className="text-muted-foreground text-md theme-transition">
                    Input:
                  </span>
                  <textarea
                    className="w-full min-h-[60px] bg-muted text-muted-foreground rounded p-2 font-mono text-md border border-border focus:outline-none mt-2 theme-transition"
                    value={customInputDraft}
                    onChange={(e) => setCustomInputDraft(e.target.value)}
                    placeholder="Enter custom input..."
                  />
                </div>
                <button
                  className="px-4 py-1 rounded bg-primary/20 text-primary text-sm hover:cursor-pointer theme-transition"
                  onClick={handleAddCustomTestcase}
                  disabled={!customInputDraft.trim()}
                >
                  Add Testcase
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "submit" && (
          <div className="px-4 theme-transition">
            <div className="overflow-x-auto">
              {submitResults.length > 0 && (
                <div className="mb-4 text-md theme-transition text-left">
                  {submitResults.every((r) => r.verdict === "Passed") && (
                    <span className="mr-3 text-success font-medium theme-transition">
                      Accepted!
                    </span>
                  )}
                  {submitResults.some(
                    (r) => r.verdict === "Failed" || r.verdict === "Error"
                  ) && (
                    <span className="mr-3 text-destructive font-medium theme-transition">
                      Not Accepted
                    </span>
                  )}
                  <span className="text-muted-foreground text-sm theme-transition">
                    {submitResults.filter((r) => r.verdict === "Passed").length}{" "}
                    / {submitResults.length} testcases passed.
                  </span>
                </div>
              )}

              <table className="min-w-full text-muted-foreground text-sm border border-border !rounded-lg theme-transition">
                <thead>
                  <tr className="bg-muted text-muted-foreground theme-transition">
                    <th className="px-2 py-1 text-left theme-transition font-medium">
                      #
                    </th>
                    <th className="px-2 py-1 text-left theme-transition font-medium">
                      Input
                    </th>
                    <th className="px-2 py-1 text-left theme-transition font-medium">
                      Expected
                    </th>
                    <th className="px-2 py-1 text-left theme-transition font-medium">
                      Output
                    </th>
                    <th className="px-2 py-1 text-left theme-transition font-medium">
                      Verdict
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submitResults.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted-foreground py-8 theme-transition"
                      >
                        Submit your code to see the results.
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
                      <td className="px-2 py-2 whitespace-pre-wrap w-auto theme-transition text-left">
                        {res.hidden ? (
                          <span className="italic text-muted-foreground theme-transition">
                            Hidden
                          </span>
                        ) : (
                          res.input
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-pre-wrap w-auto theme-transition text-left">
                        {res.hidden ? (
                          <span className="italic text-muted-foreground theme-transition">
                            Hidden
                          </span>
                        ) : (
                          res.expected
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-pre-wrap w-auto theme-transition text-left">
                        {res.output}
                      </td>
                      <td className="px-2 py-2 theme-transition">
                        {res.verdict === "Passed" && (
                          <span className="text-green-500 flex items-center theme-transition">
                            {/* <CheckCircle2 className="w-4 h-4 mr-1 theme-transition" /> */}
                            Passed
                          </span>
                        )}
                        {res.verdict === "Failed" && (
                          <span className="text-destructive flex items-center theme-transition">
                            {/* <XCircle className="w-4 h-4 mr-1 theme-transition" /> */}
                            Failed
                          </span>
                        )}
                        {res.verdict === "Error" && res.error ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-destructive flex items-center cursor-pointer underline decoration-dotted underline-offset-2 theme-transition">
                                {/* <XCircle className="w-4 h-4 mr-1 theme-transition" /> */}
                                {res.error.split("\n")[0] || "Error"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs break-words">
                              <pre className="whitespace-pre-wrap text-xs">
                                {res.error}
                              </pre>
                            </TooltipContent>
                          </Tooltip>
                        ) : res.verdict === "Error" ? (
                          <span className="text-destructive theme-transition">
                            Error
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {submitResults.some((r) => r.error) && (
              <div className="mt-2 text-destructive text-sm theme-transition">
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
          <div className="mt-2 text-destructive text-sm theme-transition">
            {error}
          </div>
        )}
      </div>
    </div>
  );
});

export default CodeEditorPanel;
