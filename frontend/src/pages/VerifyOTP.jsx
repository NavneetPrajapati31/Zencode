"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { authAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth/auth-context";
import ProfileCompletionCard from "@/components/profile/profile-completion-card";
import { jwtDecode } from "jwt-decode";

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Profile completion state
  const [profileToken, setProfileToken] = useState("");
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    username: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!email) {
      setError(
        "Invalid verification link. Please check your email for the correct link."
      );
      return;
    }
  }, [email]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authAPI.verifyOTP(email, otp);
      setIsVerified(true);

      // Store the JWT token for profile completion
      setProfileToken(result.token);

      // If profile is complete, log in and redirect immediately
      if (result.user.profileComplete) {
        await login(result.token);
        const decoded = jwtDecode(result.token);
        const username = decoded.username;

        if (username) {
          navigate(`/profile/${username}`);
        } else {
          // Fallback to problems page if user ID is not available
          navigate("/problems");
        }
      }
      // If profile is not complete, the profile completion card will be shown
    } catch (err) {
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      await authAPI.resendOTP(email);
      setError("");
      // You could show a success message here
    } catch (err) {
      setError(
        err.message || "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

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
      const decoded = jwtDecode(data.token);
      const username = decoded.username;

      if (username) {
        navigate(`/profile/${username}`);
      } else {
        // Fallback to problems page if user ID is not available
        navigate("/problems");
      }
    } catch (err) {
      setProfileError(err.message);
      localStorage.removeItem("tempToken");
    } finally {
      setProfileLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-1 border-border text-center">
              <CardTitle className="text-md font-semibold text-foreground">
                Invalid Link
              </CardTitle>
              <CardDescription className="text-sm font-light text-muted-foreground">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate("/signup")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {!isVerified ? (
          <Card className="bg-card border-border">
            <CardHeader className="space-y-1 border-border text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-md font-semibold text-foreground">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-sm font-light text-muted-foreground">
                We've sent a 6-digit verification code to{" "}
                <strong className="font-medium">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <div className="space-y-2 text-left">
                  <Label htmlFor="otp" className="text-muted-foreground">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={handleOtpChange}
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-destructive text-sm" role="alert">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-1 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="text-sm text-muted-foreground hover:text-foreground w-full"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ProfileCompletionCard
            formData={profileFormData}
            onChange={handleProfileInputChange}
            onSubmit={handleProfileSubmit}
            loading={profileLoading}
            error={profileError}
            disabled={false}
          />
        )}
      </div>
    </div>
  );
}
