import {
  List,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  CloudUpload,
  Square,
  Grid,
  Settings,
  Bell,
  User,
  Loader2,
  Sun,
  Moon,
  Home,
  Eye,
  Lock,
} from "lucide-react";
import { LuX } from "react-icons/lu";
import { RiFocus2Line, RiGeminiFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";
import { useTheme } from "@/components/theme-context-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useProblemsSidebar } from "@/components/problems/problems-sidebar-context";
import { AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Sanitize markdown: remove code fences, normalize line breaks, remove non-breaking spaces, trim leading spaces
const cleanMarkdown = (str) =>
  (str || "")
    .replace(/```[a-z]*\n?/gi, "") // remove code fences
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/^[ \t]+/gm, "")
    .trim();

export default function TopNavbar({
  onRun,
  onSubmit,
  codeEditorRef,
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = false,
}) {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useProblemsSidebar();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiReviewing, setIsAiReviewing] = useState(false);
  const [aiReviewModalOpen, setAiReviewModalOpen] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState("");
  const [aiReviewError, setAiReviewError] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const navigate = useNavigate();

  // --- Settings Modal State ---
  const [settingsSection, setSettingsSection] = useState("basic");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [basicInfoForm, setBasicInfoForm] = useState({
    avatar: user?.avatar || "",
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  const [basicInfoLoading, setBasicInfoLoading] = useState(false);
  const [basicInfoError, setBasicInfoError] = useState("");
  const [basicInfoSuccess, setBasicInfoSuccess] = useState("");
  const [socialsForm, setSocialsForm] = useState(
    user?.socialProfiles || { github: "", linkedin: "", twitter: "" }
  );
  const [socialsLoading, setSocialsLoading] = useState(false);
  const [socialsError, setSocialsError] = useState("");
  const [socialsSuccess, setSocialsSuccess] = useState("");
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityError, setVisibilityError] = useState("");
  const [visibilitySuccess, setVisibilitySuccess] = useState("");

  const sidebarItems = [
    { key: "basic", label: "Basic Info", icon: <User className="w-5 h-5" /> },

    { key: "socials", label: "Socials", icon: <Bell className="w-5 h-5" /> },

    {
      key: "visibility",
      label: "Visibility",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      key: "accounts",
      label: "Accounts",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordSave = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("All fields are required.");
      setPasswordLoading(false);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      setPasswordLoading(false);
      return;
    }
    try {
      // Call backend API to update password
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordError("Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfoForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBasicInfoForm((prev) => ({ ...prev, avatar: url }));
  };
  const handleBasicInfoSave = async () => {
    setBasicInfoLoading(true);
    setBasicInfoError("");
    setBasicInfoSuccess("");
    try {
      // PATCH/PUT to backend for name, username, avatar
      setBasicInfoSuccess("Profile updated successfully.");
    } catch {
      setBasicInfoError("Failed to update profile.");
    } finally {
      setBasicInfoLoading(false);
    }
  };
  const handleSocialsChange = (e) => {
    const { name, value } = e.target;
    setSocialsForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSocialsSave = async () => {
    setSocialsLoading(true);
    setSocialsError("");
    setSocialsSuccess("");
    try {
      // PUT to backend for social profiles
      setSocialsSuccess("Social profiles updated.");
    } catch {
      setSocialsError("Failed to update social profiles.");
    } finally {
      setSocialsLoading(false);
    }
  };
  const handleVisibilityToggle = async () => {
    setVisibilityLoading(true);
    setVisibilityError("");
    setVisibilitySuccess("");
    try {
      // PATCH to backend for isPublicProfile
      setBasicInfoForm((prev) => ({
        ...prev,
        isPublicProfile: !user.isPublicProfile,
      }));
      setVisibilitySuccess("Profile visibility updated.");
    } catch {
      setVisibilityError("Failed to update visibility.");
    } finally {
      setVisibilityLoading(false);
    }
  };

  // --- Handlers ---
  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun?.();
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious && onPrevious) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (canGoNext && onNext) {
      onNext();
    }
  };

  const handleAiReview = async () => {
    setIsAiReviewing(true);
    setAiReviewError("");
    setAiReviewResult("");
    try {
      const code = codeEditorRef?.current?.getCode?.();
      if (!code) {
        setAiReviewError("No code to review.");
        setIsAiReviewing(false);
        setAiReviewModalOpen(true);
        return;
      }
      const res = await fetch("http://localhost:8000/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setAiReviewError("AI review failed. Try again later.");
        setIsAiReviewing(false);
        setAiReviewModalOpen(true);
        return;
      }
      const data = await res.json();
      setAiReviewResult(data.aiResponse || "No response from AI.");
      setAiReviewModalOpen(true);
    } catch {
      setAiReviewError("AI review failed. Try again later.");
      setAiReviewModalOpen(true);
    } finally {
      setIsAiReviewing(false);
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setAiReviewModalOpen(false);
    setAiReviewResult("");
    setAiReviewError("");
  };

  const handleOpenSettingsModal = () => setIsSettingsModalOpen(true);
  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background theme-transition">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link to={"/"}>
            <button
              size="icon"
              className="bg-accent text-muted-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </button>
          </Link>
          <button
            size="icon"
            className="bg-accent text-muted-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            onClick={toggleSidebar}
            aria-label="Toggle problems sidebar"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            size="icon"
            className="bg-accent text-muted-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            aria-label="Previous problem"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            size="icon"
            className="bg-accent text-muted-foreground border border-border px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 theme-transition"
            aria-label="Next problem"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="bg-accent text-muted-foreground border-none px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer
          hover:bg-muted disabled:opacity-60 theme-transition"
          onClick={handleRun}
          aria-label="Run code"
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="text-sm font-normal">Run</span>
        </button>
        <button
          className="bg-green-600/20 text-green-500 px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer hover:bg-green-500/30 disabled:opacity-60"
          onClick={handleSubmit}
          aria-label="Submit code"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-3 w-3" />
          )}
          <span className="text-sm font-normal">Submit</span>
        </button>
        <button
          className="bg-primary/20 text-primary px-3 py-1.5 rounded-md flex items-center space-x-1.5 hover:cursor-pointer disabled:opacity-60 border border-none"
          onClick={handleAiReview}
          aria-label="AI Review code"
          disabled={isAiReviewing}
        >
          {isAiReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RiGeminiFill className="h-3 w-3" />
          )}
          <span className="text-sm font-normal">AI Review</span>
        </button>
      </div>

      {/* Modal for AI Review */}
      <AnimatePresence>
        {aiReviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
            onClick={handleCloseModal}
          >
            <div
              className="!bg-card border border-border text-foreground rounded-2xl shadow-lg max-w-2xl w-full pb-6 relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Browser-style header bar INSIDE the card */}
              <div
                className="w-full h-10 rounded-t-2xl bg-card flex items-center px-6 border-b border-border theme-transition"
                aria-label="Window controls"
                tabIndex={0}
              >
                <div
                  className="flex space-x-2 cursor-pointer"
                  onClick={handleCloseModal}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-500 theme-transition"
                    aria-label="Close"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-yellow-500 theme-transition"
                    aria-label="Minimize"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-500 theme-transition"
                    aria-label="Maximize"
                  />
                </div>
              </div>
              {/* <button
                className="absolute top-5 right-5 text-muted-foreground hover:cursor-pointer"
                onClick={handleCloseModal}
                aria-label="Close AI review modal"
                tabIndex={0}
              >
                <LuX className="h-5 w-5" />
              </button>
              <h2 className="text-md text-muted-foreground text-left !font-medium mb-4">
                AI Code Review
              </h2> */}
              {isAiReviewing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Reviewing...</span>
                </div>
              ) : aiReviewError ? (
                <div className="text-destructive text-sm">{aiReviewError}</div>
              ) : (
                <div
                  className="prose prose-sm prose-invert overflow-y-auto no-scrollbar bg-card !p-6 !px-8 rounded-2xl text-left text-muted-foreground prose-mono"
                  style={{ maxHeight: "50vh" }}
                >
                  {console.log("AI REVIEW RAW:", aiReviewResult)}
                  <ReactMarkdown>{cleanMarkdown(aiReviewResult)}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
          onClick={handleCloseSettingsModal}
        >
          <div
            className="flex flex-col !bg-card border border-border text-foreground rounded-xl shadow-lg max-w-4xl h-9/12 w-full p-0 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <div
              className="w-full h-10 min-h-10 flex-shrink-0 rounded-t-2xl bg-card flex items-center px-6 border-b border-border theme-transition"
              aria-label="Window controls"
              tabIndex={0}
            >
              <div
                className="flex space-x-2 cursor-pointer"
                onClick={handleCloseSettingsModal}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full bg-red-500 theme-transition"
                  aria-label="Close"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-yellow-500 theme-transition"
                  aria-label="Minimize"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-green-500 theme-transition"
                  aria-label="Maximize"
                />
              </div>
            </div>
            <div className="flex flex-row w-full h-full overflow-y-auto no-scrollbar">
              {/* Sidebar */}
              <div className="w-64 min-w-56 h-full flex flex-col border-r border-border px-4 py-6">
                <nav className="flex-1 flex flex-col gap-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.key}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${settingsSection === item.key ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
                      onClick={() => setSettingsSection(item.key)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Main Content */}
              <div className="flex flex-col px-0 overflow-y-auto no-scrollbar w-full">
                {settingsSection === "basic" && (
                  <div className="flex flex-col h-full">
                    {/* <h2 className="text-2xl font-bold mb-1">Basic Info</h2>
                  <p className="text-muted-foreground mb-6">
                    Update your basic profile information.
                  </p> */}
                    <div className="p-6 text-left">
                      <h2 className="text-md font-medium mb-1">Basic Info</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Update your basic profile information.
                      </p>
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-15 h-15">
                          <AvatarImage
                            src={basicInfoForm.avatar}
                            alt={basicInfoForm.username}
                          />
                          <AvatarFallback>
                            {basicInfoForm.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <label className="block text-sm font-medium text-left mb-1">
                            Change Avatar
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="text-sm cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-muted-foreground font-medium mb-2">
                          Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={basicInfoForm.name}
                          onChange={handleBasicInfoChange}
                          className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-muted-foreground font-medium mb-2">
                          Username
                        </label>
                        <Input
                          type="text"
                          name="username"
                          value={basicInfoForm.username}
                          onChange={handleBasicInfoChange}
                          className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
                          placeholder="Username"
                          minLength={3}
                          maxLength={20}
                          pattern="^[a-zA-Z0-9_]+$"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-muted-foreground font-medium mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={basicInfoForm.email}
                          readOnly
                          className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex mt-4">
                        <Button
                          className="px-8 py-2 rounded-md bg-accent text-foreground font-medium text-sm disabled:opacity-60"
                          onClick={handleBasicInfoSave}
                          disabled={basicInfoLoading}
                        >
                          {basicInfoLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      {basicInfoError && (
                        <div className="text-destructive text-sm mt-2">
                          {basicInfoError}
                        </div>
                      )}
                      {basicInfoSuccess && (
                        <div className="text-green-600 text-sm mt-4">
                          {basicInfoSuccess}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {settingsSection === "socials" && (
                  <div className="flex flex-col h-full p-6 text-left">
                    <h2 className="text-md font-medium mb-1">
                      Social Profiles
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Add or update your social links.
                    </p>
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground font-medium mb-2">
                        GitHub
                      </label>
                      <Input
                        type="url"
                        name="github"
                        value={socialsForm.github}
                        onChange={handleSocialsChange}
                        className="w-full px-3 py-2 rounded-md border border-border bg-muted text-foreground text-sm"
                        placeholder="GitHub URL"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground font-medium mb-2">
                        LinkedIn
                      </label>
                      <Input
                        type="url"
                        name="linkedin"
                        value={socialsForm.linkedin}
                        onChange={handleSocialsChange}
                        className="w-full px-3 py-2 rounded-md border border-border bg-muted text-foreground text-sm"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground font-medium mb-2">
                        Twitter
                      </label>
                      <Input
                        type="url"
                        name="twitter"
                        value={socialsForm.twitter}
                        onChange={handleSocialsChange}
                        className="w-full px-3 py-2 rounded-md border border-border bg-muted text-foreground text-sm"
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div className="flex mt-0">
                      <Button
                        className="px-8 py-2 rounded-md bg-accent text-foreground font-medium text-sm disabled:opacity-60"
                        onClick={handleSocialsSave}
                        disabled={socialsLoading}
                      >
                        {socialsLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    {socialsError && (
                      <div className="text-destructive text-sm mt-2">
                        {socialsError}
                      </div>
                    )}
                    {socialsSuccess && (
                      <div className="text-green-600 text-sm mt-2">
                        {socialsSuccess}
                      </div>
                    )}
                  </div>
                )}
                {settingsSection === "visibility" && (
                  <div className="flex flex-col h-full p-6 text-left">
                    <h2 className="text-md font-medium mb-1">Visibility</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Control your profile visibility.
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <label className="text-base">Public Profile</label>
                      <input
                        type="checkbox"
                        checked={user?.isPublicProfile}
                        onChange={handleVisibilityToggle}
                        className="accent-primary"
                        disabled={visibilityLoading}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Public profiles are visible to everyone.
                    </span>
                    {visibilityError && (
                      <div className="text-destructive text-sm mt-2">
                        {visibilityError}
                      </div>
                    )}
                    {visibilitySuccess && (
                      <div className="text-green-600 text-sm mt-2">
                        {visibilitySuccess}
                      </div>
                    )}
                  </div>
                )}
                {settingsSection === "accounts" && (
                  <div className="flex flex-col h-full p-6 text-left">
                    <h2 className="text-md font-medium mb-1">Accounts</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      You can manage your accounts here.
                    </p>
                    <div className="mb-8">
                      <h3 className="text-md font-medium mb-2">
                        Account Information
                      </h3>
                      <div className="flex items-center gap-8 mb-2">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-30">
                            Username
                          </span>
                          <span className="text-sm font-normal">
                            {user?.username}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-30">
                            Email:
                          </span>
                          <span className="text-sm font-normal">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-md font-medium mb-2">
                        Update Password
                      </h3>
                      <div className="flex flex-col gap-4 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-36 text-sm text-muted-foreground">
                            Original Password:
                          </span>
                          <div className="relative flex-1">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              name="oldPassword"
                              value={passwordForm.oldPassword}
                              onChange={handlePasswordChange}
                              placeholder="Old Password"
                              className="w-full px-4 py-1.5 rounded-md border border-border bg-muted text-foreground text-sm pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowOldPassword((v) => !v)}
                              tabIndex={0}
                              aria-label="Toggle old password visibility"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-36 text-sm  text-muted-foreground">
                            New Password:
                          </span>
                          <div className="relative flex-1">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="New Password"
                              className="w-full px-4 py-1.5 rounded-md border border-border bg-muted text-foreground text-sm pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowNewPassword((v) => !v)}
                              tabIndex={0}
                              aria-label="Toggle new password visibility"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-36 text-sm text-muted-foreground">
                            Confirm Password:
                          </span>
                          <div className="relative flex-1">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm Password"
                              className="w-full px-4 py-1.5 rounded-md border border-border bg-muted text-foreground text-sm pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowConfirmPassword((v) => !v)}
                              tabIndex={0}
                              aria-label="Toggle confirm password visibility"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <Button
                          className="px-8 py-2 rounded-md bg-accent text-foreground font-medium text-sm disabled:opacity-60"
                          onClick={handlePasswordSave}
                          disabled={
                            passwordLoading ||
                            !passwordForm.oldPassword ||
                            !passwordForm.newPassword ||
                            !passwordForm.confirmPassword
                          }
                        >
                          {passwordLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      {passwordError && (
                        <div className="text-destructive text-sm mt-2">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="text-green-600 text-sm mt-2">
                          {passwordSuccess}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          disabled={isTransitioning}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTheme();
            }
          }}
          className={`ml-2 p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center hover:cursor-pointer ${
            theme === "dark"
              ? "bg-accent border border-border"
              : "bg-card border border-border"
          } ${isTransitioning ? "opacity-75" : ""}`}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <button
          className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
            theme === "dark"
              ? "bg-accent border border-border"
              : "bg-card border border-border"
          }`}
          aria-label="Settings"
          tabIndex={0}
          onClick={handleOpenSettingsModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenSettingsModal();
            }
          }}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </button>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer"
              tabIndex={0}
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 theme-transition">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || user?.email || "User"}
                />
                <AvatarFallback className="text-sm border border-border theme-transition">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <AnimatePresence>
            {dropdownOpen && (
              <DropdownMenuContent
                align="end"
                className="min-w-56 mt-2 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                asChild
                forceMount
              >
                <div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{
                    duration: 0.32,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <DropdownMenuLabel className="theme-transition">
                    <div className="flex items-center text-lg gap-2 theme-transition">
                      <Avatar className="h-10 w-10 theme-transition">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.name || user?.email || "User"}
                        />
                        <AvatarFallback className="text-sm border border-border theme-transition">
                          {user?.name
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col theme-transition">
                        <span className="font-medium text-sm theme-transition">
                          {user?.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground theme-transition">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="theme-transition" />
                  {/* <DropdownMenuItem
                        onClick={toggleTheme}
                        className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground theme-transition"
                        aria-label={
                          theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                        }
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTheme();
                          }
                        }}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4 text-primary theme-transition" />
                        ) : (
                          <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
                        )}
                        <span className="text-sm theme-transition">
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="text-muted-foreground cursor-pointer theme-transition"
                    aria-label="Logout"
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer theme-transition"
                    aria-label="Logout"
                  >
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </div>
    </nav>
  );
}
