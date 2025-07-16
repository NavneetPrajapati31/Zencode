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

export default function CodeEditorPanel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTestcaseTab, setActiveTestcaseTab] = useState("testcase");

  const testcaseTabs = [
    { value: "testcase", label: "Testcase", icon: CheckSquare },
    { value: "test-result", label: "Test Result", icon: Play },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between bg-zinc-700 p-3 border-b border-zinc-600">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-zinc-300" />
          <span className="font-medium text-zinc-100">Code</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-zinc-300 hover:bg-zinc-600 px-2 py-1.5 rounded-md flex items-center space-x-1"
            >
              <span>C++</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md shadow-lg z-10">
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
          <button className="text-zinc-300 hover:bg-zinc-600 px-2 py-1.5 rounded-md">
            Auto
          </button>
          <div className="flex space-x-1 ml-4">
            <button className="text-zinc-300 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <AlignLeft className="h-4 w-4" />
              <span className="sr-only">Format Code</span>
            </button>
            <button className="text-zinc-300 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </button>
            <button className="text-zinc-300 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Braces className="h-4 w-4" />
              <span className="sr-only">Braces</span>
            </button>
            <button className="text-zinc-300 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset Code</span>
            </button>
            <button className="text-zinc-300 hover:bg-zinc-600 p-2 rounded-md flex items-center justify-center">
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Maximize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Area (Static) */}
      <div className="flex-1 bg-zinc-800 p-4 text-sm font-mono overflow-auto relative">
        <div className="absolute top-0 left-0 w-8 text-right pr-2 text-zinc-500 select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="ml-8 text-zinc-100">
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
      <div className="bg-zinc-800 border-t border-zinc-700 p-4">
        <div className="w-full">
          <div className="grid w-full grid-cols-2 bg-zinc-700 text-zinc-300 rounded-md p-1 mb-4">
            {testcaseTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTestcaseTab(tab.value)}
                className={`px-3 py-1.5 flex items-center justify-center space-x-1.5 rounded-sm transition-colors duration-200 ${
                  activeTestcaseTab === tab.value
                    ? "bg-zinc-600 text-zinc-100"
                    : "hover:bg-zinc-600/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTestcaseTab === "testcase" && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-zinc-600 px-4 py-2 rounded-md">
                  Case 1
                </button>
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-zinc-600 px-4 py-2 rounded-md">
                  Case 2
                </button>
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-zinc-600 px-4 py-2 rounded-md">
                  Case 3
                </button>
                <button className="text-zinc-300 hover:bg-zinc-700 p-2 rounded-md flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Add Test Case</span>
                </button>
              </div>
              <div className="bg-zinc-700 p-3 rounded-md text-sm font-mono">
                <p className="text-zinc-400 mb-1">nums =</p>
                <pre className="text-zinc-100">[2,7,11,15]</pre>
              </div>
              <div className="flex items-center justify-end mt-4 text-zinc-400 text-sm space-x-2">
                <Link className="h-4 w-4" />
                <span>Source</span>
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
          )}
          {activeTestcaseTab === "test-result" && (
            <div className="text-zinc-300">Test Result content goes here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
