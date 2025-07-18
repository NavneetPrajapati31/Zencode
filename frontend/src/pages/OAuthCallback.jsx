import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/auth-context";

const OAuthCallback = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("OAuth token:", token);
    if (token) {
      (async () => {
        try {
          await login(token);
          navigate("/dashboard");
        } catch (err) {
          console.error("Login error:", err);
          navigate("/signin");
        }
      })();
    }
    // Do nothing if no token
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-lg text-muted-foreground">Signing you in...</div>
    </div>
  );
};

export default OAuthCallback;
