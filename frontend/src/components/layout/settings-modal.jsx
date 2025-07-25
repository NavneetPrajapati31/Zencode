import React, { useState, useEffect } from "react";
import { User, Bell, Lock, Settings, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { profileAPI } from "@/utils/api";
import AvatarUploader from "../comp-554";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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

const SettingsModal = ({ isOpen, onClose, user, setUser }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [publicProfile, setPublicProfile] = useState(user?.isPublicProfile);
  const [prevUsername, setPrevUsername] = useState(user?.username || "");

  console.log("Rendering SettingsModal, avatar:", basicInfoForm?.avatar);

  useEffect(() => {
    if (isOpen) {
      setBasicInfoForm({
        avatar: user?.avatar || "",
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
      });
      setSocialsForm(
        user?.socialProfiles || { github: "", linkedin: "", twitter: "" }
      );
      setPublicProfile(user?.isPublicProfile);
      setPrevUsername(user?.username || "");
    }
    // Only run on modal open
  }, [
    isOpen,
    user?.avatar,
    user?.name,
    user?.username,
    user?.email,
    user?.socialProfiles,
    user?.isPublicProfile,
  ]);

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
      await profileAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfoForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleBasicInfoSave = async () => {
    setBasicInfoLoading(true);
    setBasicInfoError("");
    setBasicInfoSuccess("");
    try {
      const payload = {
        name: basicInfoForm.name,
        username: basicInfoForm.username,
        avatar: basicInfoForm.avatar, // Use state directly
      };
      console.log("[SettingsModal] PATCH payload:", payload);
      const res = await profileAPI.updateBasicInfo(payload);
      setBasicInfoSuccess("Profile updated successfully.");
      if (res && res.user) {
        setUser(res.user); // Update main user state
        setBasicInfoForm({
          avatar: res.user.avatar || "",
          name: res.user.name || "",
          username: res.user.username || "",
          email: res.user.email || "",
        }); // Sync form with backend
        // If a new token is returned, update localStorage and re-authenticate
        if (res.token) {
          localStorage.setItem("token", res.token);
          if (login) await login(res.token);
        }
        // Redirect if username changed
        if (
          prevUsername &&
          res.user.username &&
          prevUsername !== res.user.username
        ) {
          navigate(`/profile/${res.user.username}`);
        }
      }
    } catch (err) {
      setBasicInfoError(err.message || "Failed to update profile.");
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
      await profileAPI.updateSocialProfiles(user.username, socialsForm);
      setSocialsSuccess("Social profiles updated.");
    } catch (err) {
      setSocialsError(err.message || "Failed to update social profiles.");
    } finally {
      setSocialsLoading(false);
    }
  };
  const handleVisibilityToggle = async (newValue) => {
    setVisibilityLoading(true);
    setVisibilityError("");
    setVisibilitySuccess("");
    try {
      await profileAPI.patchPublicProfile({ isPublicProfile: newValue });
      setVisibilitySuccess("Profile visibility updated.");
      setUser({ ...user, isPublicProfile: newValue });
      setPublicProfile(newValue);
    } catch (err) {
      setVisibilityError(err.message || "Failed to update visibility.");
    } finally {
      setVisibilityLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="flex flex-col !bg-card border border-border text-foreground rounded-xl shadow-lg max-w-lg sm:max-w-xl md:max-w-3xl h-9/12 w-full p-0 relative"
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
          <div className="flex space-x-2 cursor-pointer" onClick={onClose}>
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
        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto no-scrollbar">
          {/* Sidebar */}
          <div className="w-full md:w-64 md:min-w-56 h-auto md:h-full flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-border px-2 md:px-4 py-2 md:py-6 bg-card z-10">
            <nav className="flex-1 flex flex-row md:flex-col gap-1 w-full">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer w-full md:w-auto justify-center md:justify-start ${settingsSection === item.key ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
                  onClick={() => setSettingsSection(item.key)}
                  tabIndex={0}
                  aria-label={item.label}
                >
                  <span className="hidden md:block">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="block md:hidden">{item.icon}</span>
                </button>
              ))}
            </nav>
          </div>
          {/* Main Content */}
          <div className="flex flex-col px-0 overflow-y-auto no-scrollbar w-full">
            {settingsSection === "basic" && (
              <div className="flex flex-col h-full">
                <div className="p-6 text-left">
                  <h2 className="text-md font-medium mb-1">Basic Info</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Update your basic profile information.
                  </p>
                  <div className="flex items-center gap-4 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-left text-muted-foreground mb-1">
                        Change Avatar
                      </label>
                      <AvatarUploader
                        value={basicInfoForm.avatar}
                        loading={avatarLoading}
                        error={avatarError}
                        onChange={async (croppedBlob) => {
                          if (croppedBlob === null) {
                            setBasicInfoForm((prev) => ({
                              ...prev,
                              avatar: "",
                            }));
                            return;
                          }
                          if (!croppedBlob) return;
                          setAvatarLoading(true);
                          setAvatarError("");
                          try {
                            const formData = new FormData();
                            formData.append("file", croppedBlob);
                            formData.append(
                              "upload_preset",
                              CLOUDINARY_UPLOAD_PRESET
                            );
                            const res = await fetch(
                              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                              {
                                method: "POST",
                                body: formData,
                              }
                            );
                            const data = await res.json();
                            if (data.secure_url) {
                              setBasicInfoForm((prev) => ({
                                ...prev,
                                avatar: data.secure_url,
                              }));
                            } else {
                              setAvatarError("Cloudinary upload failed");
                            }
                          } catch (err) {
                            setAvatarError(
                              err.message || "Failed to upload avatar."
                            );
                          } finally {
                            setAvatarLoading(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                <h2 className="text-md font-medium mb-1">Social Profiles</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Add or update your social links.
                </p>
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
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
                  <Switch
                    checked={publicProfile}
                    onCheckedChange={handleVisibilityToggle}
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
                      <span className="text-sm font-normal">{user?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-md font-medium mb-2">Update Password</h3>
                  <div className="flex flex-col gap-4 max-w-lg">
                    <div className="flex items-center gap-0">
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
                    <div className="flex items-center gap-0">
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
                    <div className="flex items-center gap-0">
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
  );
};

export default SettingsModal;
