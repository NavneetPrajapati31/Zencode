import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiEdit2, FiExternalLink } from "react-icons/fi";
import { TbFlameFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import Heatmap from "@/components/profile/heatmap";
import SocialProfileModal from "@/components/profile/social-profile-modal";
import { Switch } from "@/components/ui/switch";
import { getCurrentStreakFromHeatmapData } from "@/lib/utils";

const medalIcons = [
  {
    icon: "🥇",
    label: "Gold Medal",
    badge: "Zen Master",
    classname: "bg-blue-600/20 text-blue-500",
    ring: "border-blue-500",
  },
  {
    icon: "🥈",
    label: "Silver Medal",
    badge: "Zen Sage",
    classname: "bg-rose-600/20 text-rose-500",
    ring: "border-rose-500",
  },
  {
    icon: "🥉",
    label: "Bronze Medal",
    badge: "Zen Sensei",
    classname: "bg-violet-600/20 text-violet-500",
    ring: "border-violet-500",
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
  /* console.log("ProfileView props:", {
    user,
    leaderboardRank,
    progressStats,
    totalProblems,
    recentSubmissions,  
    socialProfiles,
    heatmapData,
    isPublicView,
  }); */

  // Calculate current streak from heatmapData
  const currentStreak = getCurrentStreakFromHeatmapData(heatmapData);

  return (
    <div className="h-full flex justify-center items-center px-6 lg:px-10 mb-8 theme-transition">
      <div
        className="w-full grid grid-cols-1 md:grid-cols-4 md:[grid-template-rows:auto_1fr] min-h-[500px] gap-6 py-4 lg:px-0 lg:py-6"
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
            <span className="text-sm text-muted-foreground theme-transition">
              Profile
            </span>
            {/* <div
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
            </div> */}
          </div>
          <div className="flex flex-col w-full">
            {((leaderboardRank != null &&
              leaderboardRank >= 1 &&
              leaderboardRank <= 3) ||
              currentStreak >= 1) && (
              <div className="flex flex-row justify-start">
                <div
                  className={
                    leaderboardRank != null &&
                    leaderboardRank >= 1 &&
                    leaderboardRank <= 3
                      ? `${medalIcons[leaderboardRank - 1].classname} text-sm px-3 py-0.5 ml-6 w-fit mt-4 rounded-3xl flex flex-row mr-1`
                      : "text-sm px-3 py-0.5 rounded-3xl w-fit mt-4 flex flex-row"
                  }
                >
                  {leaderboardRank != null &&
                    leaderboardRank >= 1 &&
                    leaderboardRank <= 3 &&
                    medalIcons[leaderboardRank - 1].badge}
                </div>
                {/* Streak badge: only show if streak >= 1 */}
                {currentStreak >= 1 && (
                  <div className="text-sm bg-primary/10 text-primary px-3 py-0.5 w-fit mt-4 rounded-3xl flex flex-row justify-center items-center">
                    <TbFlameFilled className="mr-1 h-3 w-3" />
                    {currentStreak}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-row gap-3 w-full justify-start items-center py-4 pt-3 px-6">
              <Avatar className="h-13 w-13">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || user?.email || "User"}
                />
                <AvatarFallback className="text-xl theme-transition text-muted-foreground">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center text-left">
                {/* <div
                className={
                  leaderboardRank != null &&
                  leaderboardRank >= 1 &&
                  leaderboardRank <= 3
                    ? `${medalIcons[leaderboardRank - 1].classname} text-sm mb-2 px-3 py-0.5 rounded-3xl w-fit`
                    : "text-sm mb-2 px-3 py-0.5 rounded-3xl"
                }
              >
                {leaderboardRank != null &&
                  leaderboardRank >= 1 &&
                  leaderboardRank <= 3 &&
                  medalIcons[leaderboardRank - 1].badge}
              </div> */}
                <span
                  className={`${
                    leaderboardRank >= 1 &&
                    leaderboardRank <= 3 &&
                    medalIcons[leaderboardRank - 1].classname
                  } !bg-transparent !text-foreground font-medium theme-transition`}
                >
                  {user?.name || "User"}
                </span>
                <span className="text-muted-foreground text-sm font-normal theme-transition">
                  {user?.username ? `@${user.username}` : ""}
                </span>
              </div>
            </div>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6">
            <span className="flex flex-row justify-between text-sm font-normal text-muted-foreground text-left mb-0.5 theme-transition">
              Leaderboard Rank
              <span className="flex flex-row gap-2 text-md font-semibold mb-2 ml-2 text-muted-foreground theme-transition">
                {leaderboardRank !== null ? (
                  <span
                    className={`${
                      leaderboardRank >= 1 &&
                      leaderboardRank <= 3 &&
                      medalIcons[leaderboardRank - 1].classname
                    } !bg-transparent`}
                  >
                    #{leaderboardRank}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </span>
            </span>
            <span className="flex flex-row justify-between text-sm font-normal text-muted-foreground text-left mb-2 theme-transition">
              Zen Score
              <span className="flex flex-row gap-2 text-md font-semibold mb-1 ml-2 text-muted-foreground theme-transition">
                <span
                  className={`${
                    leaderboardRank >= 1 &&
                    leaderboardRank <= 3 &&
                    medalIcons[leaderboardRank - 1].classname
                  } !bg-transparent`}
                >
                  {user?.score ?? "-"}
                </span>
              </span>
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
            <span className="text-sm text-muted-foreground text-left theme-transition">
              Socials
            </span>
            {isPublicView ? (
              <>
                <Button
                  onClick={() => onSocialClick && onSocialClick("github")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none theme-transition"
                  aria-label="GitHub profile"
                  disabled={!socialProfiles.github}
                >
                  <FaGithub className="h-6 w-6" />
                  Github
                </Button>
                <Button
                  onClick={() => onSocialClick && onSocialClick("linkedin")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none theme-transition"
                  aria-label="LinkedIn profile"
                  disabled={!socialProfiles.linkedin}
                >
                  <FaLinkedin className="h-6 w-6" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => onSocialClick && onSocialClick("twitter")}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm !shadow-none theme-transition"
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
                  className="flex justify-between!bg-accent text-muted-foreground text-sm !shadow-none theme-transition flex-row justify-between items-center group"
                >
                  <span
                    className="flex flex-row items-center flex-1 min-w-0"
                    onClick={() => onSocialClick && onSocialClick("github")}
                  >
                    <FaGithub className="h-6 w-6" />
                    <span className="ml-2 truncate">
                      {socialProfiles.github &&
                      socialProfiles.github.trim() !== ""
                        ? "GitHub"
                        : "Add Github"}
                    </span>
                  </span>
                  {socialProfiles.github &&
                    socialProfiles.github.trim() !== "" && (
                      <span className="flex flex-row items-center ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSocialClick && onSocialClick("github");
                          }}
                          aria-label="Edit GitHub profile"
                          tabIndex={0}
                          className="p-1 rounded bg-transparent cursor-pointer focus:outline-none transition-colors"
                        >
                          <FiEdit2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-focus:text-foreground transition-colors" />
                        </button>
                        <a
                          href={socialProfiles.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={0}
                          aria-label="Open GitHub profile in new tab"
                          className="ml-1 p-1 rounded bg-transparent cursor-pointer focus:outline-none text-muted-foreground group-hover:text-foreground focus:text-muted-foreground transition-colors"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      </span>
                    )}
                </Button>
                <Button
                  variant={"outline"}
                  className="flex justify-between!bg-accent text-muted-foreground text-sm !shadow-none theme-transition flex-row justify-between items-center group"
                  onClick={() => onSocialClick && onSocialClick("linkedin")}
                >
                  <span className="flex flex-row items-center flex-1 min-w-0">
                    <FaLinkedin className="h-6 w-6" />
                    <span className="ml-2 truncate">
                      {socialProfiles.linkedin &&
                      socialProfiles.linkedin.trim() !== ""
                        ? "LinkedIn"
                        : "Add LinkedIn"}
                    </span>
                  </span>
                  {socialProfiles.linkedin &&
                    socialProfiles.linkedin.trim() !== "" && (
                      <span className="flex flex-row items-center ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSocialClick && onSocialClick("linkedin");
                          }}
                          aria-label="Edit LinkedIn profile"
                          tabIndex={0}
                          className="p-1 rounded bg-transparent cursor-pointer focus:outline-none transition-colors"
                        >
                          <FiEdit2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-focus:text-foreground transition-colors" />
                        </button>
                        <a
                          href={socialProfiles.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={0}
                          aria-label="Open LinkedIn profile in new tab"
                          className="ml-1 p-1 rounded bg-transparent cursor-pointer focus:outline-none text-muted-foreground group-hover:text-foreground focus:text-muted-foreground transition-colors"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      </span>
                    )}
                </Button>
                <Button
                  variant={"outline"}
                  className="flex justify-between!bg-accent text-muted-foreground text-sm !shadow-none theme-transition flex-row justify-between items-center group"
                  onClick={() => onSocialClick && onSocialClick("twitter")}
                >
                  <span className="flex flex-row items-center flex-1 min-w-0">
                    <FaXTwitter className="h-6 w-6" />
                    <span className="ml-2 truncate">
                      {socialProfiles.twitter &&
                      socialProfiles.twitter.trim() !== ""
                        ? "Twitter"
                        : "Add Twitter"}
                    </span>
                  </span>
                  {socialProfiles.twitter &&
                    socialProfiles.twitter.trim() !== "" && (
                      <span className="flex flex-row items-center ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSocialClick && onSocialClick("twitter");
                          }}
                          aria-label="Edit Twitter profile"
                          tabIndex={0}
                          className="p-1 rounded bg-transparent cursor-pointer focus:outline-none transition-colors"
                        >
                          <FiEdit2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-focus:text-foreground transition-colors" />
                        </button>
                        <a
                          href={socialProfiles.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={0}
                          aria-label="Open Twitter profile in new tab"
                          className="ml-1 p-1 rounded bg-transparent cursor-pointer focus:outline-none text-muted-foreground group-hover:text-foreground focus:text-muted-foreground transition-colors"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      </span>
                    )}
                </Button>
              </>
            )}
          </div>
          {!isPublicView && (
            <>
              <Separator className="!w-10/12" />
              <div className="flex flex-row w-full justify-between py-4 px-6 gap-2">
                <span className="text-sm text-muted-foreground theme-transition">
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
                  className="cursor-pointer"
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
            <span className="text-sm text-muted-foreground theme-transition">
              Progress
            </span>
            <span className="text-sm text-muted-foreground theme-transition">
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
            <span className="text-sm text-muted-foreground theme-transition">
              Recent Submissions
            </span>
          </div>
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            {recentSubmissions && recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub, idx) => (
                <Link to={`/problems/${sub.problemId}`} key={sub._id || idx}>
                  <Button
                    key={sub._id || idx}
                    variant={"outline"}
                    className="!bg-accent w-full text-muted-foreground text-sm justify-between !shadow-none theme-transition"
                  >
                    <span className="text-sm font-normal truncate">
                      {sub.problemTitle || sub.problemName || sub.title || "-"}
                    </span>
                    <span className="text-sm font-normal">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </span>
                  </Button>
                </Link>
              ))
            ) : (
              <div className="flex flex-1 min-h-[120px] w-full items-center justify-center py-4 px-6 gap-2">
                <span className="text-muted-foreground text-sm theme-transition">
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
            <span className="text-sm text-muted-foreground theme-transition">
              Activity
            </span>
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
