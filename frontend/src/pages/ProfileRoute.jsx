import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/use-auth";
import Profile from "./ProfileV2";
import PublicProfile from "./PublicProfile";

const ProfileRoute = () => {
  const { user } = useAuth();
  const { username } = useParams();

  if (user && user.username === username) {
    return <Profile />;
  }
  return <PublicProfile />;
};

export default ProfileRoute;
