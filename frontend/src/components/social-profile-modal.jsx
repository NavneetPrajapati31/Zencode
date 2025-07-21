import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { X } from "lucide-react";

export default function SocialProfileModal({
  isOpen,
  onClose,
  onSubmit,
  currentProfiles = {},
  platform = null,
}) {
  const [profiles, setProfiles] = useState({
    github: currentProfiles.github || "",
    linkedin: currentProfiles.linkedin || "",
    twitter: currentProfiles.twitter || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfiles({
      github: currentProfiles.github || "",
      linkedin: currentProfiles.linkedin || "",
      twitter: currentProfiles.twitter || "",
    });
  }, [currentProfiles, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(profiles);
      onClose();
    } catch (error) {
      console.error("Failed to update social profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfiles((prev) => ({ ...prev, [field]: value }));
  };

  const getPlatformInfo = () => {
    switch (platform) {
      case "github":
        return {
          icon: <FaGithub className="h-4 w-4" />,
          label: "GitHub Profile",
          placeholder: "https://github.com/username",
          field: "github",
        };
      case "linkedin":
        return {
          icon: <FaLinkedin className="h-4 w-4" />,
          label: "LinkedIn Profile",
          placeholder: "https://linkedin.com/in/username",
          field: "linkedin",
        };
      case "twitter":
        return {
          icon: <FaXTwitter className="h-4 w-4" />,
          label: "Twitter Profile",
          placeholder: "https://twitter.com/username",
          field: "twitter",
        };
      default:
        return null;
    }
  };

  const platformInfo = getPlatformInfo();

  if (!isOpen || !platformInfo) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg  flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-medium">Update {platformInfo.label}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-3">
            <Label
              htmlFor={platformInfo.field}
              className="flex items-center text-sm font-normal gap-2"
            >
              {platformInfo.icon}
              {platformInfo.label}
            </Label>
            <Input
              id={platformInfo.field}
              type="url"
              placeholder={platformInfo.placeholder}
              value={profiles[platformInfo.field]}
              onChange={(e) =>
                handleInputChange(platformInfo.field, e.target.value)
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
