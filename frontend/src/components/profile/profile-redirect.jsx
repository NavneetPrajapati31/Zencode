import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";
import { Loader2 } from "lucide-react";

const ProfileRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.username) {
        // Redirect to user's profile page
        navigate(`/profile/${user.username}`, { replace: true });
      } else if (isAuthenticated && !user?.username) {
        // User is authenticated but no username, redirect to problems
        navigate("/problems", { replace: true });
      } else {
        // User is not authenticated, redirect to signin
        navigate("/signin", { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading state while determining redirect
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-lg text-muted-foreground">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    </div>
  );
};

export default ProfileRedirect;
