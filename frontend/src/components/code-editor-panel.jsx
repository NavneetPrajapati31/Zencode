"use client";

import { useState } from "react";
import {
  Code,
  ChevronDown,
  AlignLeft,
  Bookmark,
  Braces,
  RotateCcw,
  Maximize,
  CheckSquare,
  Plus,
  Link,
  HelpCircle,
  Play,
} from "lucide-react";

export default function CodeEditorPanel({ problem }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTestcaseTab, setActiveTestcaseTab] = useState("testcase");
  if (!problem) {
    return <div className="p-4 text-zinc-300">No problem data available.</div>;
  }

  const testcaseTabs = [
    { value: "testcase", label: "Testcase", icon: CheckSquare },
    { value: "test-result", label: "Test Result", icon: Play },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between bg-slate-900 !px-4 !py-1 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-400 text-sm">Code</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-slate-400 hover:bg-zinc-600 px-2 py-1.5 rounded-md flex items-center space-x-1 text-sm"
            >
              <span>C++</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-700 border border-zinc-600 text-slate-400 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    // Handle language selection
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-600"
                >
                  JavaScript
                </button>
                <button
                  onClick={() => {
                    // Handle language selection
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-600"
                >
                  Python
                </button>
                <button
                  onClick={() => {
                    // Handle language selection
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-600"
                >
                  Java
                </button>
              </div>
            )}
          </div>
          <button className="text-slate-400 hover:bg-zinc-600 px-2 py-1.5 rounded-md text-sm">
            Auto
          </button>
          <div className="flex space-x-1 ml-4">
            <button className="text-slate-400 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <AlignLeft className="h-4 w-4" />
              <span className="sr-only">Format Code</span>
            </button>
            <button className="text-slate-400 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </button>
            <button className="text-slate-400 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Braces className="h-4 w-4" />
              <span className="sr-only">Braces</span>
            </button>
            <button className="text-slate-400 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset Code</span>
            </button>
            <button className="text-slate-400 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Maximize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Area (Static) */}
      <div className="flex-1 bg-slate-900 p-4 text-sm font-mono overflow-auto relative">
        <div className="absolute top-0 left-0 w-8 text-right pr-2 text-slate-400 select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="ml-8 text-slate-400 text-left">
          <code>
            <span className="text-blue-400">class</span>{" "}
            <span className="text-green-400">Solution</span> {"{"}
            {"\n"} <span className="text-blue-400">public</span>:{"\n"}{" "}
            <span className="text-blue-400">vector</span>
            &lt;<span className="text-blue-400">int</span>&gt;{" "}
            <span className="text-yellow-400">twoSum</span>(
            <span className="text-blue-400">vector</span>&lt;
            <span className="text-blue-400">int</span>&gt;&amp;{" "}
            <span className="text-orange-400">nums</span>,{" "}
            <span className="text-blue-400">int</span>{" "}
            <span className="text-orange-400">target</span>) {"{"}
            {"\n"}
            {"\n"} {"}"};{"\n"}
          </code>
        </pre>
        <div className="absolute bottom-2 right-4 text-zinc-500 text-xs">
          Saved <span className="ml-2">Ln 6, Col 3</span>
        </div>
      </div>

      {/* Testcase Section */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-6">
        <div className="w-full">
          <div className="grid w-full grid-cols-2 bg-slate-900 text-slate-400 rounded-md mb-4 gap-2">
            {testcaseTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTestcaseTab(tab.value)}
                className={`px-3 py-1.5 text-sm flex items-center justify-center space-x-1.5 rounded-sm transition-colors duration-200 ${
                  activeTestcaseTab === tab.value
                    ? "bg-slate-800 text-slate-400"
                    : "hover:bg-slate-800"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTestcaseTab === "testcase" && (
            <div>
              <div className="flex items-center space-x-2 mb-4 text-sm text-slate-400">
                <button className="bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-md">
                  Case 1
                </button>
                <button className="bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-md">
                  Case 2
                </button>
                <button className="bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-md">
                  Case 3
                </button>
                <button className="text-slate-400 p-2 rounded-md flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Test Case</span>
                </button>
              </div>
              <div className="bg-slate-800 p-3 rounded-md text-sm font-mono text-left">
                <p className="text-slate-400 mb-1">nums =</p>
                <pre className="text-slate-400">[2,7,11,15]</pre>
              </div>
            </div>
          )}
          {activeTestcaseTab === "test-result" && (
            <div className="text-slate-400 text-sm py-6">
              Test Result content goes here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
