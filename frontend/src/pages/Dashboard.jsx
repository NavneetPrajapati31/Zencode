import React from "react";
import { useAuth } from "@/components/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Button
        className="bg-red-600/30 text-red-400 font-medium px-6 py-2 rounded-md shadow hover:bg-red-600/50 transition-colors"
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </Button>
    </div>
  );
}
