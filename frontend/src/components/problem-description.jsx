"use client";

import { useState } from "react";
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

export default function ProblemDescription() {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { value: "description", label: "Description", icon: FileText },
    { value: "editorial", label: "Editorial", icon: BookOpen },
    { value: "solutions", label: "Solutions", icon: FlaskConical },
    { value: "submissions", label: "Submissions", icon: FileText },
  ];

  return (
    <div className="p-4 overflow-y-auto">
      {/* Tabs */}
      <div className="w-full">
        <div className="grid w-full grid-cols-4 bg-zinc-700 text-zinc-300 rounded-md p-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 flex items-center justify-center space-x-1.5 rounded-sm transition-colors duration-200 ${
                activeTab === tab.value
                  ? "bg-zinc-600 text-zinc-100"
                  : "hover:bg-zinc-600/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div>
            {/* Problem Title and Solved Status */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-zinc-100">1. Two Sum</h1>
              <span className="text-green-500 flex items-center space-x-1">
                Solved <CheckCircle className="h-5 w-5" />
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-green-600/20 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Easy
              </span>
              <span className="bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Topics
              </span>
              <span className="bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Companies
              </span>
              <span className="bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Hint
              </span>
            </div>

            {/* Problem Statement */}
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm text-left">
              <p>
                Given an array of integers{" "}
                <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                  nums
                </code>{" "}
                and an integer{" "}
                <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                  target
                </code>
                , return indices of the two numbers such that they add up to{" "}
                <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                  target
                </code>
                .
              </p>
              <p>
                You may assume that each input would have{" "}
                <strong className="italic">exactly one solution</strong>, and
                you may not use the{" "}
                <strong className="italic">same element twice</strong>.
              </p>
              <p>You can return the answer in any order.</p>

              {/* Examples */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-zinc-100 mb-1">
                    Example 1:
                  </h3>
                  <div className="bg-zinc-700 p-3 rounded-md text-xs">
                    <pre>
                      <code className="block">
                        Input: nums = [2,7,11,15], target = 9
                      </code>
                      <code className="block">Output: [0,1]</code>
                      <code className="block">
                        Explanation: Because nums[0] + nums[1] == 9, we return
                        [0, 1].
                      </code>
                    </pre>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 mb-1">
                    Example 2:
                  </h3>
                  <div className="bg-zinc-700 p-3 rounded-md text-xs">
                    <pre>
                      <code className="block">
                        Input: nums = [3,2,4], target = 6
                      </code>
                      <code className="block">Output: [1,2]</code>
                      <code className="block">
                        Explanation: Because nums[1] + nums[2] == 6, we return
                        [1, 2].
                      </code>
                    </pre>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 mb-1">
                    Example 3:
                  </h3>
                  <div className="bg-zinc-700 p-3 rounded-md text-xs">
                    <pre>
                      <code className="block">
                        Input: nums = [3,3], target = 6
                      </code>
                      <code className="block">Output: [0,1]</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-100">Constraints:</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>
                    <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                      2 &lt;= nums.length &lt;= 10^4
                    </code>
                  </li>
                  <li>
                    <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                      -10^9 &lt;= nums[i] &lt;= 10^9
                    </code>
                  </li>
                  <li>
                    <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-100">
                      -10^9 &lt;= target &lt;= 10^9
                    </code>
                  </li>
                  <li>Only one valid answer exists.</li>
                </ul>
              </div>
            </div>

            {/* Bottom Interaction Bar */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-700 text-zinc-400 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-zinc-300">
                  <ThumbsUp className="h-4 w-4" />
                  <span>62.8K</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-zinc-300">
                  <ThumbsDown className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-zinc-300">
                  <MessageSquare className="h-4 w-4" />
                  <span>1.5K</span>
                </div>
                <div className="cursor-pointer hover:text-zinc-300">
                  <Star className="h-4 w-4" />
                </div>
                <div className="cursor-pointer hover:text-zinc-300">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="cursor-pointer hover:text-zinc-300">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>3295 Online</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "editorial" && (
          <div className="text-zinc-300">Editorial content goes here.</div>
        )}
        {activeTab === "solutions" && (
          <div className="text-zinc-300">Solutions content goes here.</div>
        )}
        {activeTab === "submissions" && (
          <div className="text-zinc-300">Submissions content goes here.</div>
        )}
      </div>
    </div>
  );
}
