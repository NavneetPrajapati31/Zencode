import { useAuth } from "./use-auth";
import { Navigate } from "react-router-dom";
import NotAuthorized from "@/pages/not-authorized";
import { Loader2 } from "lucide-react";

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== "admin") {
    return <NotAuthorized />;
  }

  return children;
}

export default AdminRoute;
