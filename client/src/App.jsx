import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProblemsPage from "./pages/problems";
import ProblemDetailPage from "./pages/problem-detail";
import ProblemCreatePage from "./pages/problem-create";
import ProblemEditPage from "./pages/problem-edit";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import { Button } from "./components/ui/button";

const App = () => (
  <Router>
    <nav className="bg-gray-100 p-4 flex gap-4">
      <Link to="/" className="font-bold">
        Home
      </Link>
      <Link to="/problems" className="font-bold">
        Problems
      </Link>
      {/* Add other nav links here */}
    </nav>
    <Routes>
      <Route path="/" element={<Button>Click me</Button>} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/problems/new" element={<ProblemCreatePage />} />
      <Route path="/problems/:id" element={<ProblemDetailPage />} />
      <Route path="/problems/:id/edit" element={<ProblemEditPage />} />
      {/* Add other routes here */}
    </Routes>
  </Router>
);

export default App;
