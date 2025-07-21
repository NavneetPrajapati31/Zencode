import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Heatmap from "@/components/profile/heatmap";
import SocialProfileModal from "@/components/profile/social-profile-modal";
import { Switch } from "@/components/ui/switch";

const medalIcons = [
  {
    icon: "🥇",
    label: "Gold Medal",
    badge: "Zen Master",
    classname: "bg-blue-600/20 text-blue-600",
    ring: "border-blue-600",
  },
  {
    icon: "🥈",
    label: "Silver Medal",
    badge: "Zen Sage",
    classname: "bg-rose-600/20 text-rose-600",
    ring: "border-rose-600",
  },
  {
    icon: "🥉",
    label: "Bronze Medal",
    badge: "Zen Sensei",
    classname: "bg-violet-600/20 text-violet-600",
    ring: "border-violet-600",
  },
];

const ProfileView = ({
  user,
  leaderboardRank,
  progressStats,
  totalProblems,
  recentSubmissions,
  socialProfiles,
  onSocialClick,
  isModalOpen,
  setIsModalOpen,
  selectedPlatform,
  setSelectedPlatform,
  onUpdateSocialProfiles,
  heatmapData,
  isPublicProfile,
  isPublicProfileLoading,
  isPublicProfileError,
  onTogglePublicProfile,
  isPublicView = false,
}) => {
  if (!user) return null;

  // Debug logs for props
  console.log("ProfileView props:", {
    user,
    leaderboardRank,
    progressStats,
    totalProblems,
    recentSubmissions,
    socialProfiles,
    heatmapData,
    isPublicView,
  });

  const navigate = useNavigate();

  return (
    <div className="h-full flex justify-center items-center px-6 lg:px-10 mb-8 theme-transition">
      <div
        className="w-full grid grid-cols-1 md:grid-cols-4 md:[grid-template-rows:auto_1fr] min-h-[500px] gap-6 pb-4 lg:px-0 lg:pb-6"
        aria-label="Profile bento grid"
      >
        {/* First row: 3 cards */}
        <Card
          className="h-full flex flex-col items-center justify-center bg-card border border-border md:col-span-1 md:row-span-2 p-0 gap-0 shadow-none theme-transition"
          aria-label="Profile summary"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center pl-6 pr-4 border-b border-border justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Profile</span>
            <div
              className={
                leaderboardRank != null &&
                leaderboardRank >= 1 &&
                leaderboardRank <= 3
                  ? `${medalIcons[leaderboardRank - 1].classname} text-sm px-3 py-0.5 rounded-3xl`
                  : "text-sm px-2 py-0.5 rounded-3xl"
              }
            >
              {leaderboardRank != null &&
                leaderboardRank >= 1 &&
                leaderboardRank <= 3 &&
                medalIcons[leaderboardRank - 1].badge}
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center py-4 px-6">
            <Avatar className="h-20 w-20 mb-3 border border-border">
              <AvatarImage
                src={user?.avatar}
                alt={user?.name || user?.email || "User"}
              />
              <AvatarFallback className="text-3xl theme-transition text-muted-foreground">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-md mb-1 font-medium">
              {user?.name || "User"}
            </span>
            <span className="text-muted-foreground text-sm font-normal">
              {user?.username ? `@${user.username}` : ""}
            </span>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6">
            <span className="text-sm font-normal text-muted-foreground text-left mb-2">
              Leaderboard Rank
            </span>
            <span className="flex flex-row gap-2 text-md font-semibold mb-2 text-muted-foreground">
              <BiSolidBarChartAlt2 className="w-5 h-5 " />
              {leaderboardRank !== null ? "#" : ""}
              {leaderboardRank !== null ? leaderboardRank : "-"}
            </span>
            <Link to={"/leaderboard"}>
              <Button
                variant={"outline"}
                className="w-full text-sm !bg-primary/10 text-primary hover:text-primary border-none !shadow-none"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <span className="text-sm text-muted-foreground text-left">
              Socials
            </span>
            {isPublicView ? (
              <>
                <Button
                  onClick={() => onSocialClick && onSocialClick("github")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  aria-label="GitHub profile"
                  disabled={!socialProfiles.github}
                >
                  <FaGithub className="h-6 w-6" />
                  Github
                </Button>
                <Button
                  onClick={() => onSocialClick && onSocialClick("linkedin")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  aria-label="LinkedIn profile"
                  disabled={!socialProfiles.linkedin}
                >
                  <FaLinkedin className="h-6 w-6" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => onSocialClick && onSocialClick("twitter")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  aria-label="Twitter profile"
                  disabled={!socialProfiles.twitter}
                >
                  <FaXTwitter className="h-6 w-6" />
                  Twitter
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  onClick={() => onSocialClick && onSocialClick("github")}
                >
                  <FaGithub className="h-6 w-6" />
                  {socialProfiles.github && socialProfiles.github.trim() !== ""
                    ? "GitHub"
                    : "Add Github"}
                </Button>
                <Button
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  onClick={() => onSocialClick && onSocialClick("linkedin")}
                >
                  <FaLinkedin className="h-6 w-6" />
                  {socialProfiles.linkedin &&
                  socialProfiles.linkedin.trim() !== ""
                    ? "LinkedIn"
                    : "Add LinkedIn"}
                </Button>
                <Button
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none"
                  onClick={() => onSocialClick && onSocialClick("twitter")}
                >
                  <FaXTwitter className="h-6 w-6" />
                  {socialProfiles.twitter &&
                  socialProfiles.twitter.trim() !== ""
                    ? "Twitter"
                    : "Add Twitter"}
                </Button>
              </>
            )}
          </div>
          <Separator className="!w-10/12" />
          {!isPublicView && (
            <>
              <div className="flex flex-row w-full justify-between py-4 px-6 gap-2">
                <span className="text-sm text-muted-foreground">
                  Public Profile
                </span>
                <Switch
                  checked={isPublicProfile}
                  onCheckedChange={onTogglePublicProfile}
                  disabled={isPublicProfileLoading}
                  aria-label={
                    isPublicProfile
                      ? "Your profile is public. Toggle to make private."
                      : "Your profile is private. Toggle to make public."
                  }
                />
              </div>
              {isPublicProfileError && (
                <div className="px-6 pb-2 text-xs text-red-500">
                  {isPublicProfileError}
                </div>
              )}
            </>
          )}
        </Card>
        <Card
          className="h-full flex items-center justify-center bg-card border-border md:col-span-1 p-0 gap-0 shadow-none theme-transition"
          aria-label="Bento card 2"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              {progressStats.easy + progressStats.medium + progressStats.hard}/
              {totalProblems}
            </span>
          </div>
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="text-sm justify-between !bg-green-600/10 !text-green-600 border-none !shadow-none"
            >
              <span className="text-sm font-normal">Easy</span>
              <span className="text-sm font-normal">{progressStats.easy}</span>
            </Button>
            <Button
              variant={"outline"}
              className="!bg-primary/10 !text-primary text-sm justify-between border-none !shadow-none"
            >
              <span className="text-sm font-normal">Medium</span>
              <span className="text-sm font-normal">
                {progressStats.medium}
              </span>
            </Button>
            <Button
              variant={"outline"}
              className="!bg-red-600/10 !text-destructive text-sm justify-between border-none !shadow-none"
            >
              <span className="text-sm font-normal">Hard</span>
              <span className="text-sm font-normal">{progressStats.hard}</span>
            </Button>
          </div>
        </Card>
        <Card
          className="h-full flex items-center bg-card border-border md:col-span-2 p-0 gap-0 shadow-none theme-transition"
          aria-label="Bento card 2"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">
              Recent Submissions
            </span>
          </div>
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            {recentSubmissions && recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub, idx) => (
                <Button
                  key={sub._id || idx}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm justify-between !shadow-none"
                >
                  <span className="text-sm font-normal truncate">
                    {sub.problemTitle || sub.problemName || sub.title || "-"}
                  </span>
                  <span className="text-sm font-normal">
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </Button>
              ))
            ) : (
              <div className="flex flex-1 min-h-[120px] w-full items-center justify-center py-4 px-6 gap-2">
                <span className="text-muted-foreground text-sm">
                  No recent submissions
                </span>
              </div>
            )}
          </div>
        </Card>
        {/* Second row: 1 card spanning all columns */}
        <Card
          className="flex items-center bg-card md:col-span-3 border-border p-0 gap-0 shadow-none theme-transition"
          aria-label="Bento card 4"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Activity</span>
          </div>
          <Heatmap data={heatmapData} />
        </Card>
      </div>
      {!isPublicView && (
        <SocialProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onUpdateSocialProfiles}
          currentProfiles={socialProfiles}
          platform={selectedPlatform}
        />
      )}
    </div>
  );
};

export default ProfileView;
