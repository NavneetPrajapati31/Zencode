"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, Code2, Github, Mail } from "lucide-react";
import { authAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth/auth-context";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL;

const GITHUB_OAUTH_URL = `${apiUrl}/auth/github`;
const GOOGLE_OAUTH_URL = `${apiUrl}/auth/google`;

const handleGithubOAuth = () => {
  window.location.href = GITHUB_OAUTH_URL;
};

const handleGoogleOAuth = () => {
  window.location.href = GOOGLE_OAUTH_URL;
};

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // console.log("Signin form submitted:", { email: formData.email });

    try {
      // console.log("Calling authAPI.signin...");
      const result = await authAPI.signin({
        email: formData.email,
        password: formData.password,
      });
      // console.log("Signin API response:", result);

      // console.log("Calling login function...");
      await login(result.token);
      // console.log("Login successful, navigating to profile");

      // Decode the token to get user ID for navigation
      const decoded = jwtDecode(result.token);
      const username = decoded.username;

      if (username) {
        navigate(`/profile/${username}`);
      } else {
        // Fallback to problems page if user ID is not available
        navigate("/problems");
      }
    } catch (err) {
      console.error("Signin error:", err);

      // If email is not verified, redirect to OTP verification
      if (err.message && err.message.includes("verify your email")) {
        // Extract email from the form data
        const email = formData.email;
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 custom-autofill">
      <div className="w-full max-w-xl space-y-8">
        {/* Logo and Header */}
        {/* <div className="text-center">
          <p className="text-xl font-bold text-foreground">
            Welcome back, Coder!
          </p>
          <p className="!text-md text-muted-foreground mt-2">
            Sign in to access coding challenges
          </p>
        </div> */}

        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 border-border">
            <CardTitle className="text-lg font-semibold text-center text-foreground">
              Sign in
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-card border-border text-muted-foreground"
                onClick={handleGithubOAuth}
                type="button"
              >
                <FaGithub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="bg-card border-border text-muted-foreground hover:bg-muted"
                onClick={handleGoogleOAuth}
                type="button"
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="!bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="!bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 !bg-transparent text-muted-foreground !hover:bg-transparent hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-border bg-muted text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground bg-card"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="text-destructive text-sm mb-2" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign in
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="hover:text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
