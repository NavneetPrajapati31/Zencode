import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import React from "react";
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

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="h-full flex justify-center items-center px-6 lg:px-10 mb-8">
      {/* Hero Content */}

      <div
        className="w-full grid grid-cols-1 md:grid-cols-4 md:[grid-template-rows:auto_1fr] min-h-[500px] gap-6 py-4 lg:px-0 lg:py-6"
        aria-label="Profile bento grid"
      >
        {/* First row: 3 cards */}
        <Card
          className="h-full flex flex-col items-center justify-center border-border md:col-span-1 md:row-span-2 p-0 gap-0"
          aria-label="Profile summary"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border theme-transition justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Profile</span>
          </div>
          <div className="flex flex-col w-full justify-center items-center py-4 px-6">
            <Avatar className="h-20 w-20 theme-transition mb-3">
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
            <h2 className="text-lg font-medium text-foreground">
              Navneet Prajapati
            </h2>
            <span className="text-muted-foreground text-sm font-normal">
              {`@${user.username}`}
            </span>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6">
            <span className="text-sm font-normal text-muted-foreground !text-left mb-2">
              Leaderboard Rank
            </span>
            <span className="flex flex-row gap-2 text-md font-semibold text-foreground mb-2">
              <BiSolidBarChartAlt2 className="w-5 h-5" />
              690
            </span>
            <Link to={"/leaderboard"}>
              <Button
                variant={"outline"}
                className="!w-full text-sm !bg-primary/10 text-primary hover:text-primary !border-none"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
          <Separator className="!w-10/12" />
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm"
            >
              <FaGithub className="h-6 w-6" />
              Add Github
            </Button>

            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm"
            >
              <FaLinkedin className="h-6 w-6" />
              Add LinkedIn
            </Button>
            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm"
            >
              <FaXTwitter className="h-6 w-6" />
              Add Twitter
            </Button>
          </div>
        </Card>
        <Card
          className="h-full flex items-center justify-center border-border md:col-span-1 p-0 gap-0"
          aria-label="Bento card 2"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border theme-transition justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">125/300</span>
          </div>
          {/* <ProblemsBarChart /> */}
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="text-sm justify-between !bg-green-600/10 !text-green-600 border-none"
            >
              <span className="text-sm font-normal">Easy</span>
              <span className="text-sm font-normal">30</span>
            </Button>

            <Button
              variant={"outline"}
              className="!bg-primary/10 !text-primary text-sm justify-between border-none"
            >
              <span className="text-sm font-normal">Medium</span>
              <span className="text-sm font-normal">57</span>
            </Button>
            <Button
              variant={"outline"}
              className="!bg-red-600/10 !text-destructive text-sm justify-between border-none"
            >
              <span className="text-sm font-normal">Hard</span>
              <span className="text-sm font-normal">38</span>
            </Button>
            {/* <Button
                variant={"outline"}
                className="!text-muted-foreground text-sm justify-between border-none"
              >
                <span>Total</span>
                <span>125</span>
              </Button> */}
          </div>
        </Card>
        <Card
          className="h-full flex items-center justify-center border-border md:col-span-2 p-0 gap-0"
          aria-label="Bento card 2"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border theme-transition justify-between"
            aria-label="Window controls"
            tabIndex={0}
          >
            <span className="text-sm text-muted-foreground">
              Recent Submissions
            </span>
          </div>
          {/* <ProblemsBarChart /> */}
          <div className="flex flex-col w-full justify-center py-4 px-6 gap-2">
            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm justify-between"
            >
              <span className="text-sm font-normal truncate">
                Longest Substring Without Repeating Characters
              </span>
              <span className="text-sm font-normal">Jul 20, 2025</span>
            </Button>

            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm justify-between"
            >
              <span className="text-sm font-normal truncate">
                Container With Most Water
              </span>
              <span className="text-sm font-normal">Jul 19, 2025</span>
            </Button>
            <Button
              variant={"outline"}
              className="text-muted-foreground text-sm justify-between"
            >
              <span className="text-sm font-normal truncate">
                Integer to Roman
              </span>
              <span className="text-sm font-normal">Jul 17, 2025</span>
            </Button>
            {/* <Button
            variant={"outline"}
            className="!text-muted-foreground text-sm justify-between border-none"
          >
            <span>Total</span>
            <span>125</span>
          </Button> */}
          </div>
        </Card>
        {/* <Card
            className="h-full flex items-center justify-center border-border md:col-span-1 p-0 gap-0"
            aria-label="Bento card 3"
            tabIndex={0}
          /> */}
        {/* Second row: 1 card spanning all columns */}
        <Card
          className="flex items-center md:col-span-3 border-border p-0 gap-0"
          aria-label="Bento card 4"
          tabIndex={0}
        >
          <div
            className="w-full h-10 rounded-t-2xl bg-transparent flex items-center px-6 border-b border-border theme-transition justify-between"
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
