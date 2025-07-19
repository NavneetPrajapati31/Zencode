import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/auth-context";
import ProfileCompletionModal from "@/components/profile-completion-modal";

const OAuthCallback = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Parse token and profileComplete from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    const pc = params.get("profileComplete");
    setToken(t || "");
    if (t && pc === "false") {
      // Decode token to get username suggestion
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        setFormData({
          fullName: payload.name || "",
          username: payload.username || "",
        });
      } catch {
        setFormData({ fullName: "", username: "" });
      }
      setShowProfileModal(true);
    } else if (t) {
      // Profile is complete, log in
      (async () => {
        try {
          await login(t);
          // Navigation will happen in the next useEffect
        } catch {
          navigate("/signin");
        }
      })();
    }
  }, [login, navigate]);

  // Navigate to profile after login when user is set
  useEffect(() => {
    if (user && user.username) {
      navigate(`/profile/${user.username}`);
    }
  }, [user, navigate]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            username: formData.username,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile completion failed");
      await login(data.token);
      setShowProfileModal(false);
      // Navigation will happen in the next useEffect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-lg text-muted-foreground">Signing you in...</div>
      <ProfileCompletionModal
        open={showProfileModal}
        onSubmit={handleProfileSubmit}
        formData={formData}
        onChange={handleProfileInputChange}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default OAuthCallback;
