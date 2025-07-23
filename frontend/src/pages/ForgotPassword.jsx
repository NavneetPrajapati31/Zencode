"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { authAPI } from "@/utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
      setCooldown(60); // Start cooldown
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
      cooldownRef.current = null;
    }
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
        cooldownRef.current = null;
      }
    };
  }, [cooldown]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-1 border-border text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-md font-semibold text-foreground">
                Check your email
              </CardTitle>
              <CardDescription className="text-sm font-light text-muted-foreground">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="text-sm text-muted-foreground text-center">
                <p>
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      if (cooldown === 0) setIsSubmitted(false);
                    }}
                    className={`text-primary hover:text-primary/80 underline disabled:cursor-not-allowed`}
                    disabled={cooldown > 0}
                    aria-disabled={cooldown > 0}
                    tabIndex={cooldown > 0 ? -1 : 0}
                  >
                    {cooldown > 0 ? `try again in ${cooldown}s` : "try again"}
                  </button>
                </p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link to="/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
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
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 border-border">
            <CardTitle className="text-md font-semibold text-center text-foreground">
              Forgot your password?
            </CardTitle>
            <CardDescription className="text-center text-sm font-light text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-destructive text-sm" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send reset link
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                asChild
                className="w-full !bg-accent text-muted-foreground"
              >
                <Link to="/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
