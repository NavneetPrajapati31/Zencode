import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, UserCheck } from "lucide-react";

const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

export default function ProfileCompletionCard({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  disabled,
}) {
  const isFormValid =
    formData.fullName.trim() && validateUsername(formData.username);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="space-y-1 border-border text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserCheck className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-md font-semibold text-foreground">
          Complete Your Profile
        </CardTitle>
        <CardDescription className="text-sm font-light text-muted-foreground">
          Please provide your full name and choose a username to complete your
          registration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2 text-left">
            <Label htmlFor="fullName" className="text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={onChange}
              required
              autoFocus
              className="!bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="username" className="text-muted-foreground">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={onChange}
              required
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_]{3,20}$"
              autoComplete="off"
              className="!bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isFormValid || loading || disabled}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
