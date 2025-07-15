import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism.css";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Plus,
  X,
  Trash2,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  History,
  AlertTriangle,
  Circle,
  FileText,
} from "lucide-react";
import { compilerAPI } from "@/utils/api";

const SUPPORTED_LANGUAGES = [
  {
    name: "C++",
    extension: "cpp",
    prism: "cpp",
    defaultCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello World!\\n";\n  return 0;\n}',
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
    case "cpp":
      return <FileText className="w-4 h-4 text-blue-400" />;
    case "python":
      return <FileText className="w-4 h-4 text-yellow-400" />;
    case "javascript":
      return <FileText className="w-4 h-4 text-yellow-300" />;
    case "java":
      return <FileText className="w-4 h-4 text-orange-400" />;
    default:
      return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

const extractErrorMessage = (err) => {
  console.log("Error for extractErrorMessage:", err); // Debug log
  if (!err) return "Unknown error";
  // Handle Error objects
  if (err instanceof Error) {
    // Try to parse the message as JSON
    try {
      const parsed = JSON.parse(err.message);
      return extractErrorMessage(parsed);
    } catch {
      return err.message || "Unknown error";
    }
  }
  if (typeof err === "string") {
    if (err.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(err);
        return extractErrorMessage(parsed);
      } catch {
        return err;
      }
    }
    return err;
  }
  if (err.stderr) return err.stderr;
  if (err.error && err.error.stderr) return err.error.stderr;
  if (
    err.error &&
    typeof err.error === "object" &&
    Object.keys(err.error).length > 0
  ) {
    return JSON.stringify(err.error, null, 2);
  }
  if (typeof err === "object" && Object.keys(err).length > 0) {
    return JSON.stringify(err, null, 2);
  }
  return "Unknown error";
};

export default function CodeRunner() {
  const [files, setFiles] = useState([
    {
      name: "main.cpp",
      language: "cpp",
      code: SUPPORTED_LANGUAGES[0].defaultCode,
      output: "",
    },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [error, setError] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(320); // px, default w-80
  const resizerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const mainAreaRef = useRef(null);
  const containerRightRef = useRef(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRootRef = useRef(null);

  // Drag handlers for sidebar resizer
  const handleResizerMouseDown = () => {
    if (window.innerWidth < 768) return;
    isDraggingRef.current = true;
    if (mainAreaRef.current) {
      const rect = mainAreaRef.current.getBoundingClientRect();
      containerRightRef.current = rect.right;
    }
    window.addEventListener("mousemove", handleResizerMouseMove);
    window.addEventListener("mouseup", handleResizerMouseUp);
  };
  const handleResizerMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const minWidth = 240;
    const maxWidth = 700;
    const mouseX = e.clientX;
    const containerRight = containerRightRef.current;
    let newWidth = containerRight - mouseX;
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setSidebarWidth(newWidth);
  };
  const handleResizerMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener("mousemove", handleResizerMouseMove);
    window.removeEventListener("mouseup", handleResizerMouseUp);
  };

  // No global listeners needed; handled in mouseDown/mouseUp

  const handleAddFile = () => {
    const lang = SUPPORTED_LANGUAGES[0];
    const newFile = {
      name: `main${files.length}.${lang.extension}`,
      language: lang.prism,
      code: lang.defaultCode,
      output: "",
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const handleCloseFile = (idx) => {
    if (files.length === 1) return;
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setActiveFileIndex(idx === 0 ? 0 : idx - 1);
  };

  const handleSwitchFile = (idx) => setActiveFileIndex(idx);

  const handleCodeChange = (code) => {
    setFiles((prev) =>
      prev.map((file, idx) =>
        idx === activeFileIndex ? { ...file, code } : file
      )
    );
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError("");
    setFiles((prev) =>
      prev.map((file, idx) =>
        idx === activeFileIndex ? { ...file, output: "" } : file
      )
    );
    try {
      const res = await compilerAPI.runCode({
        language: activeFile.language,
        code: activeFile.code,
      });
      const output =
        res.output?.stdout || res.output?.stderr || res.output || "";
      setFiles((prev) =>
        prev.map((file, idx) =>
          idx === activeFileIndex ? { ...file, output } : file
        )
      );
    } catch (err) {
      console.log("Caught error:", err); // Debug log
      const errorMsg = extractErrorMessage(err);
      setError(errorMsg);
      setFiles((prev) =>
        prev.map((file, idx) =>
          idx === activeFileIndex ? { ...file, output: errorMsg } : file
        )
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.prism === newLang);
    setFiles((prev) =>
      prev.map((file, idx) =>
        idx === activeFileIndex
          ? {
              ...file,
              language: langObj.prism,
              name: `main.${langObj.extension}`,
              code: langObj.defaultCode,
            }
          : file
      )
    );
  };

  const handleClearOutput = () => {
    setFiles((prev) =>
      prev.map((file, idx) =>
        idx === activeFileIndex ? { ...file, output: "" } : file
      )
    );
  };

  const activeFile = files[activeFileIndex];

  // Helper to update cursor position
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

  // Update cursor position when switching files or code changes
  useEffect(() => {
    setTimeout(() => {
      updateCursorPosition();
    }, 0);
    // eslint-disable-next-line
  }, [activeFileIndex, activeFile.code]);

  return (
    <div className="h-screen bg-slate-900 text-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-12 bg-black border-b border-slate-800 flex items-center justify-between px-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-300">
            Online Compiler
          </span>
        </div>
      </div>

      {/* File Tabs Row */}
      <div className="h-12 bg-black border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center overflow-x-auto">
          {files.map((file, idx) => (
            <div
              key={file.name + idx}
              className={`flex items-center px-3 py-2 ml-1 cursor-pointer ${
                idx === activeFileIndex ? "bg-slate-900" : "hover:bg-slate-900"
              } ${files.length > 1 ? "mr-1" : ""} transition-colors duration-300`}
              tabIndex={0}
              aria-label={`Switch to ${file.name}`}
              onClick={() => handleSwitchFile(idx)}
              onKeyDown={(e) => e.key === "Enter" && handleSwitchFile(idx)}
            >
              {getFileIcon(file.language)}
              <span className="text-sm text-gray-200 ml-2">{file.name}</span>
              {files.length > 1 && (
                <Button
                  size="sm"
                  className="ml-auto p-0 h-2 w-2 !bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(idx);
                  }}
                  aria-label={`Close ${file.name}`}
                >
                  <X className="w-2 h-2" />
                </Button>
              )}
            </div>
          ))}
          <Button
            size="sm"
            className="ml-2 h-2 w-2 text-gray-400 hover:text-white !bg-transparent"
            onClick={handleAddFile}
            aria-label="Add new file"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4 px-4">
          <span className="text-sm text-gray-400">{activeFile.name}</span>
          <select
            value={activeFile.language}
            onChange={handleLanguageChange}
            className="ml-2 bg-slate-900 text-gray-200 text-xs rounded px-2 py-1 focus:outline-none border border-slate-800 hover:cursor-pointer"
            aria-label="Select language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.prism} value={lang.prism}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-1 px-2">
          {/* <div className="flex items-center space-x-2">
            <Switch
              checked={showOnlyLatest}
              onCheckedChange={setShowOnlyLatest}
              className="scale-75"
              aria-label="Show only latest output"
            />
            <span className="text-xs text-gray-400">Show Only Latest</span>
          </div> */}
          <button
            size="sm"
            className="text-gray-400 hover:text-white !bg-transparent flex flex-row justify-center items-center"
            onClick={handleClearOutput}
            aria-label="Clear output"
          >
            <span className="text-xs">Clear</span>
          </button>

          <button
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="text-gray-400 hover:text-white !bg-transparent flex flex-row justify-center items-center"
            aria-label="Run code"
          >
            <Play className="w-3 h-3 mr-2" />
            <span className="text-xs">Run</span>
          </button>

          {/* <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-slate-700"
            onClick={handleClearOutput}
            aria-label="Clear output (icon)"
          >
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      </div>

      {/* Main Content Area */}
      <div ref={mainAreaRef} className="flex-1 flex flex-col md:flex-row">
        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0" style={{ minWidth: 0 }}>
          <div className="flex-1 relative bg-slate-900">
            <div className="absolute inset-0 flex overflow-auto">
              {/* Line Numbers and Code Editor scroll together */}
              <div className="flex w-full">
                {/* Line Numbers */}
                <div className="w-8 bg-black border-r border-slate-800 flex flex-col text-right text-sm text-slate-600 py-[14px] select-none">
                  {Array.from({
                    length: activeFile.code.split("\n").length || 1,
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 flex items-center justify-end pr-3"
                      style={{ lineHeight: "1.5rem" }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Code Area with Syntax Highlighting */}
                <div className="flex-1 relative min-w-0">
                  <div className="p-1 font-mono text-sm leading-6 min-h-full text-gray-100">
                    <div ref={editorRootRef} className="h-full">
                      <Editor
                        value={activeFile.code}
                        onValueChange={handleCodeChange}
                        highlight={(code) =>
                          highlight(
                            code,
                            languages[activeFile.language] || languages.clike
                          )
                        }
                        padding={10}
                        textareaId="codeArea"
                        textareaClassName="outline-none bg-transparent w-full h-full"
                        className="min-h-full bg-transparent text-gray-100"
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
        </div>
        {/* Resizer Handle (desktop only) */}
        <div
          ref={resizerRef}
          className="hidden md:block bg-slate-800 hover:bg-slate-600 transition-colors duration-100"
          style={{ width: 3, minWidth: 3, maxWidth: 3, cursor: "col-resize" }}
          tabIndex={0}
          aria-label="Resize sidebar"
          onMouseDown={handleResizerMouseDown}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              handleResizerMouseDown();
          }}
        />
        {/* Right Sidebar - Console */}
        <div
          className="w-full border-t border-slate-800 md:border-t-0 flex flex-col min-h-[200px] max-h-[50vh] md:max-h-none bg-slate-900"
          style={
            window.innerWidth >= 768
              ? { width: sidebarWidth, minWidth: 240, maxWidth: 700 }
              : {}
          }
        >
          <div className="flex-1 p-1 w-full">
            <div className="space-y-2">
              <div
                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-800 transition-colors duration-300 rounded mx-3 px-1 py-2 mt-2"
                onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                tabIndex={0}
                aria-label="Toggle console"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  setIsConsoleCollapsed(!isConsoleCollapsed)
                }
              >
                {isConsoleCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-300">
                  ./{activeFile.name.replace(/\..+$/, "")}
                </span>
              </div>
              {!isConsoleCollapsed && (
                <div className="px-3 min-h-[2rem]">
                  {error ? (
                    <pre className="bg-slate-900 text-red-400 font-mono text-sm rounded p-4 whitespace-pre-wrap max-h-[70vh] overflow-y-auto border border-slate-800">
                      <code>
                        {typeof error === "string"
                          ? error
                          : JSON.stringify(error, null, 2)}
                      </code>
                    </pre>
                  ) : isRunning ? (
                    <pre className="bg-slate-900 text-blue-400 font-mono text-sm rounded p-4 overflow-x-auto border border-slate-800">
                      <code>Running...</code>
                    </pre>
                  ) : activeFile.output ? (
                    <pre className="bg-slate-900 text-gray-100 font-mono text-sm rounded p-4 overflow-x-auto border border-slate-800 text-left">
                      <code>{activeFile.output}</code>
                    </pre>
                  ) : (
                    <pre className="bg-slate-900 text-gray-500 font-mono text-sm rounded p-4 overflow-x-auto border border-slate-800">
                      <code>No output</code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Console Footer */}
          {/* <div className="p-4 border-t border-slate-700"> 
             <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3 h-3" />
                <span>Ask Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>59ms • just now</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div> 
          {/* </div> */}
        </div>
      </div>
      {/* Bottom Status Bar */}
      <div className="h-10 bg-black border-t border-slate-800 flex items-center justify-between px-4 text-xs text-gray-400">
        <div className="items-center space-x-4 hidden md:flex">
          <div className="flex items-center space-x-1">
            <Circle className="w-3 h-3 text-blue-400" />
            <span>AI</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>
              {SUPPORTED_LANGUAGES.find((l) => l.prism === activeFile.language)
                ?.name || "C++"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Circle className="w-2 h-2 text-orange-400" />
            <span>0</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span>0</span>
          </div>
          <span>Diff</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span>Spaces: 2</span>
          {/* <div className="flex items-center space-x-1">
            <History className="w-3 h-3" />
            <span>History</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
