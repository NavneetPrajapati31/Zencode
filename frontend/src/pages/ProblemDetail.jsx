import TopNavbar from "@/components/top-navbar";
import ProblemDescription from "@/components/problem-description";
import CodeEditorPanel from "@/components/code-editor-panel";

export default function ProblemDetailPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-zinc-700">
          <ProblemDescription />
        </div>
        {/* Right Panel: Code Editor and Test Cases */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <CodeEditorPanel />
        </div>
      </div>
    </div>
  );
}
