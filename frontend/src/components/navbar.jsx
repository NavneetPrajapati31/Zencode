"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code, Sun, Moon, ChevronRight } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "./use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-context-utils";

export default function Navbar() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Testimonials", href: "#testimonials" },
    // { name: "Pricing", href: "#pricing" },
  ];

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();

  console.log("Navbar user:", user); // Log user object

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-3xl theme-transition">
      <div className="container mx-auto h-24 flex items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link
            to={"/"}
            className="flex items-center gap-2 text-xl font-bold text-primary theme-transition"
          >
            <RiFocus2Line className="h-10 w-10" />
            Zencode
          </Link>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 justify-center flex-none">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary theme-transition-fast"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggler and Auth */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            disabled={isTransitioning}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleTheme();
              }
            }}
            className={`ml-2 p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition-fast flex items-center justify-center hover:cursor-pointer ${
              theme === "dark"
                ? "bg-primary hover:bg-primary/85"
                : "bg-card border border-border"
            } ${isTransitioning ? "opacity-75" : ""}`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </button>
          <Link to={"/problems"}>
            <button className="flex flex-row justify-center items-center bg-primary hover:bg-primary/85 text-primary-foreground font-semibold !py-2 pl-3 pr-2 rounded-full text-xs shadow-none theme-transition-fast group hover:cursor-pointer">
              Solve now
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
          {!isAuthenticated ? (
            <>
              {/* <Link to={"signin"}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                >
                  Login
                </Button>
              </Link> */}
              <Link to={"signup"}>
                <button className="bg-card text-card-foreground border border-border font-semibold !py-2 !px-3 rounded-full text-xs shadow-none theme-transition-fast group hover:cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full hover:cursor-pointer theme-transition-fast"
                  tabIndex={0}
                  aria-label="User menu"
                >
                  {console.log("Avatar src:", user?.avatar)}
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || user?.email || "User"}
                      onError={(e) => {
                        console.error(
                          "Failed to load avatar image:",
                          user?.avatar,
                          e
                        );
                      }}
                    />
                    <AvatarFallback className="text-sm border border-border theme-transition">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-56 theme-transition"
              >
                <DropdownMenuLabel>
                  <div className="flex items-center text-lg gap-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || user?.email || "User"}
                        onError={(e) => {
                          console.error(
                            "Failed to load avatar image:",
                            user?.avatar,
                            e
                          );
                        }}
                      />
                      <AvatarFallback className="theme-transition">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm theme-transition">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground theme-transition">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer theme-transition-fast"
                  aria-label="Logout"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="theme-transition-fast"
            >
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background border-border text-foreground theme-transition"
          >
            <div className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary theme-transition-fast"
                >
                  {link.name}
                </a>
              ))}
              {/* Theme Toggler Mobile */}
              <button
                onClick={toggleTheme}
                disabled={isTransitioning}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTheme();
                  }
                }}
                className={`p-2 rounded-full border border-border bg-card hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition-fast flex items-center justify-center w-fit ${
                  isTransitioning ? "opacity-75" : ""
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="ml-2 text-sm">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              <Button
                variant="ghost"
                className="text-lg font-medium text-foreground hover:text-primary justify-start theme-transition-fast"
              >
                Login
              </Button>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold text-lg justify-start theme-transition-fast">
                Sign Up
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
