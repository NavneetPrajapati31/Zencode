import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

export default function ProfileCompletionModal({
  open,
  onSubmit,
  formData,
  onChange,
  loading,
  error,
  disabled,
}) {
  const isFormValid =
    formData.fullName.trim() && validateUsername(formData.username);

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 backdrop-blur-md animate-fade-in" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-none border border-border focus:outline-none animate-fade-in flex flex-col">
          <DialogPrimitive.Title className="text-md font-semibold mb-2 text-foreground">
            Complete Your Profile
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mb-6 text-muted-foreground text-sm">
            Please provide your full name and choose a username.
          </DialogPrimitive.Description>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
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
              />
            </div>
            <div className="space-y-2">
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
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || loading || disabled}
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
