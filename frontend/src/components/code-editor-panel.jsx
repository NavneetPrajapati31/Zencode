import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  return (
    <div className="flex flex-col h-full">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between bg-zinc-700 p-3 border-b border-zinc-600">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-zinc-300" />
          <span className="font-medium text-zinc-100">Code</span>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-zinc-300 hover:bg-zinc-600 px-2 py-1.5 rounded-md flex items-center space-x-1"
              >
                <span>C++</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-700 border border-zinc-600 text-zinc-100">
              <DropdownMenuItem className="hover:bg-zinc-600 cursor-pointer">
                JavaScript
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-600 cursor-pointer">
                Python
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-600 cursor-pointer">
                Java
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="text-zinc-300 hover:bg-zinc-600 px-2 py-1.5 rounded-md"
          >
            Auto
          </Button>
          <div className="flex space-x-1 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-zinc-600"
            >
              <AlignLeft className="h-4 w-4" />
              <span className="sr-only">Format Code</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-zinc-600"
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-zinc-600"
            >
              <Braces className="h-4 w-4" />
              <span className="sr-only">Braces</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-zinc-600"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset Code</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-zinc-600"
            >
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Maximize</span>
            </Button>
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
        <Tabs defaultValue="testcase" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-700 text-zinc-300 rounded-md p-1 mb-4">
            <TabsTrigger
              value="testcase"
              className="data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-100 rounded-sm px-3 py-1.5 flex items-center space-x-1.5"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Testcase</span>
            </TabsTrigger>
            <TabsTrigger
              value="test-result"
              className="data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-100 rounded-sm px-3 py-1.5 flex items-center space-x-1.5"
            >
              <Play className="h-4 w-4" />
              <span>Test Result</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testcase">
            <div className="flex items-center space-x-2 mb-4">
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600 px-4 py-2 rounded-md"
              >
                Case 1
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600 px-4 py-2 rounded-md"
              >
                Case 2
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600 px-4 py-2 rounded-md"
              >
                Case 3
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:bg-zinc-700"
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">Add Test Case</span>
              </Button>
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
          </TabsContent>
          {/* Other TabsContent for Test Result would go here */}
        </Tabs>
      </div>
    </div>
  );
}
