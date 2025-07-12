import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Button>Click me</Button>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
