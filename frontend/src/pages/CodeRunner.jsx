import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Plus,
  MoreHorizontal,
  Terminal,
  FileText,
  Settings,
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  History,
  AlertTriangle,
  Circle,
} from "lucide-react";

export default function CodeEditor() {
  const [code, setCode] = useState(`#include <iostream>

int main() { std::cout << "Hello World!\\n"; }`);
  const [output, setOutput] = useState("Hello World!");
  const [isRunning, setIsRunning] = useState(false);
  const [showOnlyLatest, setShowOnlyLatest] = useState(true);
  const [activeTab, setActiveTab] = useState("main.cpp");
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const textareaRef = useRef(null);

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput("Hello World!");
      setIsRunning(false);
    }, 1000);
  };

  const formatCode = () => {
    setCode(code.trim());
  };

  return (
    <div className="h-screen bg-slate-900 text-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-300">
            Online Compiler
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={runCode}
            disabled={isRunning}
            className="text-gray-300 hover:text-white hover:bg-slate-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      {/* File Tabs Row */}
      {/* <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center bg-slate-700 px-3 py-2 border-r border-slate-600">
            <FileText className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm text-gray-200">{activeTab}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-0 h-4 w-4 hover:bg-slate-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 px-4">
          <span className="text-sm text-gray-400">main.cpp</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            Format
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 px-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Console</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showOnlyLatest}
                onCheckedChange={setShowOnlyLatest}
                className="scale-75"
              />
              <span className="text-xs text-gray-400">Show Only Latest</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-slate-700"
            >
              <span className="text-xs">Clear Past Runs</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-slate-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div> */}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - File Explorer */}
        {/* <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="flex-1 p-3">
            <div className="flex items-center space-x-2 py-1 px-2 hover:bg-slate-700 rounded cursor-pointer">
              <ChevronDown className="w-4 h-4 text-gray-400" />
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-200">main.cpp</span>
            </div>
            <div className="ml-6 flex items-center space-x-2 py-1 px-2 hover:bg-slate-700 rounded cursor-pointer">
              <span className="text-sm text-gray-400">main</span>
            </div>
          </div>
        </div>*/}

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-slate-900">
            <div className="absolute inset-0 flex">
              {/* Line Numbers */}
              <div className="w-12 bg-slate-800 border-r border-slate-700 flex flex-col text-right text-sm text-gray-500 py-4">
                <div className="h-6 flex items-center justify-end pr-3">1</div>
                <div className="h-6 flex items-center justify-end pr-3">2</div>
                <div className="h-6 flex items-center justify-end pr-3">3</div>
              </div>

              {/* Code Area with Syntax Highlighting */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 p-4 font-mono text-sm leading-6">
                  <div className="text-purple-400">
                    #include{" "}
                    <span className="text-green-400">&lt;iostream&gt;</span>
                  </div>
                  <div className="h-6"></div>
                  <div>
                    <span className="text-blue-400">int</span>{" "}
                    <span className="text-yellow-300">main</span>
                    <span className="text-gray-300">() {"{"}</span>{" "}
                    <span className="text-gray-300">std::cout</span>{" "}
                    <span className="text-purple-400">&lt;&lt;</span>{" "}
                    <span className="text-green-400">"Hello World!\\n"</span>
                    <span className="text-gray-300">; {"}"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Console */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <div
                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-700 rounded px-2 py-1"
                onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
              >
                {isConsoleCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-300">./main</span>
              </div>
              {!isConsoleCollapsed && (
                <div className="ml-6 text-sm text-green-400">{output}</div>
              )}
            </div>
          </div>

          {/* Console Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3 h-3" />
                <span>Ask Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>59ms • 3 minutes ago</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-4 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Circle className="w-3 h-3 text-blue-400" />
            <span>AI</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>C++</span>
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
          <span>Ln 3, Col 43</span>
          <span>Spaces: 2</span>
          <div className="flex items-center space-x-1">
            <History className="w-3 h-3" />
            <span>History</span>
          </div>
        </div>
      </div>
    </div>
  );
}
