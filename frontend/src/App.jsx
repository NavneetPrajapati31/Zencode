import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPageV2";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProblemsPage from "./pages/Problems";
import CodeRunnerPage from "./pages/CodeRunner";
import ProblemDetail from "./pages/ProblemDetail";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";
import LeaderboardPage from "./pages/Leaderboard";
import ThemeTransitionWrapper from "./components/theme-transition-wrapper";
import { useTheme } from "./components/theme-context-utils";
import ProfileRedirect from "./components/profile-redirect";

function AppContent() {
  const { isInitialized } = useTheme();

  return (
    <div
      className={`font-inter min-h-screen bg-background text-foreground theme-transition ${!isInitialized ? "theme-not-initialized" : ""}`}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfileRedirect />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/compiler" element={<CodeRunnerPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const { isInitialized } = useTheme();

  return (
    <div className={!isInitialized ? "theme-not-initialized" : ""}>
      <ThemeTransitionWrapper className="font-inter min-h-screen bg-background text-foreground">
        <AppContent />
      </ThemeTransitionWrapper>
    </div>
  );
}

export default App;
