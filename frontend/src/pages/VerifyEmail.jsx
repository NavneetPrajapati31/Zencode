"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import { authAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";
import ProfileCompletionModal from "@/components/profile-completion-modal";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const verificationToken = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileToken, setProfileToken] = useState("");
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    username: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!verificationToken) {
        setError(
          "Invalid verification link. Please check your email for the correct link."
        );
        setIsCheckingToken(false);
        return;
      }

      try {
        const result = await authAPI.verifyEmail(verificationToken);
        setIsSuccess(true);
        setIsValidToken(true);

        // Store the JWT token for profile completion
        setProfileToken(result.token);

        // After successful verification, show profile completion modal
        setShowProfileModal(true);
      } catch {
        setError(
          "This verification link has expired or is invalid. Please request a new verification email."
        );
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyEmail();
  }, [verificationToken]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);
    try {
      // Store the JWT token temporarily for the API call
      localStorage.setItem("tempToken", profileToken);

      const data = await authAPI.completeProfile({
        fullName: profileFormData.fullName,
        username: profileFormData.username,
      });

      // Remove the temporary token
      localStorage.removeItem("tempToken");

      // Automatically log the user in after profile completion
      await login(data.token);
      setShowProfileModal(false);
      navigate("/problems");
    } catch (err) {
      setProfileError(err.message);
      localStorage.removeItem("tempToken");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await authAPI.resendVerification();
      setError("");
    } catch (err) {
      setError(
        err.message || "Failed to resend verification email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="h-[85vh] bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="h-[85vh] bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-1 border-border text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Email verified successfully!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your email has been verified. Please complete your profile to
                continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowProfileModal(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Modal */}
        <ProfileCompletionModal
          open={showProfileModal}
          onSubmit={handleProfileSubmit}
          formData={profileFormData}
          onChange={handleProfileInputChange}
          loading={profileLoading}
          error={profileError}
          disabled={false}
        />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="h-[85vh] bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-1 border-border text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Verification failed
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleResendVerification}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate("/signin")}
                className="w-full"
                variant="outline"
              >
                Back to sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
