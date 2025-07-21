import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/use-auth";
import { ProblemsBarChart } from "@/components/problems-bar-chart";
import { Separator } from "@/components/ui/separator";
import Heatmap from "@/components/heatmap";
import {
  leaderboardAPI,
  submissionAPI,
  progressAPI,
  problemsAPI,
} from "@/utils/api";

export default function Profile() {
  const { user } = useAuth();

  const [leaderboardRank, setLeaderboardRank] = useState(null);
  const [progressStats, setProgressStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return;
      try {
        // Fetch leaderboard rank
        const leaderboardRes = await leaderboardAPI.getRank(user.username);
        setLeaderboardRank(leaderboardRes.rank || null);

        // Fetch progress stats
        try {
          const progressRes = await progressAPI.getUserProgress(user.username);
          setProgressStats(
            progressRes.stats || { easy: 0, medium: 0, hard: 0 }
          );
        } catch {
          // fallback: count from user.solvedProblems if available
          if (user.solvedProblems) {
            const stats = { easy: 0, medium: 0, hard: 0 };
            user.solvedProblems.forEach((p) => {
              if (p.difficulty === "Easy") stats.easy++;
              else if (p.difficulty === "Medium") stats.medium++;
              else if (p.difficulty === "Hard") stats.hard++;
            });
            setProgressStats(stats);
          }
        }

        // Fetch recent submissions
        const submissionsRes = await submissionAPI.getUserSubmissions(
          user.username
        );
        setRecentSubmissions(submissionsRes.submissions?.slice(0, 3) || []);

        // Fetch total problem count
        try {
          const countRes = await problemsAPI.getTotalCount();
          setTotalProblems(countRes.count || 0);
        } catch {}
      } catch {
        // handle error (optional: set error state)
      }
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="h-full flex justify-center items-center px-6 lg:px-10 mb-8 theme-transition">
      {/* Hero Content */}

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
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Profile</span>
          </div>
          <div className="flex flex-col w-full justify-center items-center py-4 px-6">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage
                src={user?.avatar}
                alt={user?.name || user?.email || "User"}
              />
              <AvatarFallback className="text-3xl border border-border theme-transition">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">{user?.name || "User"}</span>
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
              {leaderboardRank !== null ? leaderboardRank : "-"}
            </span>
            <Link to={"/leaderboard"}>
              <Button
                variant={"outline"}
                className="w-full text-sm !bg-primary/10 text-primary hover:text-primary border-none"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="!bg-accent text-muted-foreground text-sm"
            >
              <FaGithub className="h-6 w-6" />
              Add Github
            </Button>

            <Button
              variant={"outline"}
              className="!bg-accent text-muted-foreground text-sm"
            >
              <FaLinkedin className="h-6 w-6" />
              Add LinkedIn
            </Button>
            <Button
              variant={"outline"}
              className="!bg-accent text-muted-foreground text-sm"
            >
              <FaXTwitter className="h-6 w-6" />
              Add Twitter
            </Button>
          </div>
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
          {/* <ProblemsBarChart /> */}
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="text-sm justify-between !bg-green-600/10 !text-green-600 border-none"
            >
              <span className="text-sm font-normal">Easy</span>
              <span className="text-sm font-normal">{progressStats.easy}</span>
            </Button>

            <Button
              variant={"outline"}
              className="!bg-primary/10 !text-primary text-sm justify-between border-none"
            >
              <span className="text-sm font-normal">Medium</span>
              <span className="text-sm font-normal">
                {progressStats.medium}
              </span>
            </Button>
            <Button
              variant={"outline"}
              className="!bg-red-600/10 !text-destructive text-sm justify-between border-none"
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
          {/* <ProblemsBarChart /> */}
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub, idx) => (
                <Button
                  key={sub._id || idx}
                  variant={"outline"}
                  className="!bg-accent text-muted-foreground text-sm justify-between"
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
          <Heatmap />
        </Card>
      </div>
    </div>
  );
}
