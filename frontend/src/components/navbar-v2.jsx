"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code, Sun, Moon, ChevronRight, Settings } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-context-utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";

export default function Navbar({ sticky = false }) {
  const navLinks = [
    { name: "Problems", href: "/problems" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Profile", href: "/profile" },
    // { name: "Pricing", href: "#pricing" },
  ];

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const location = useLocation();

  console.log("Navbar user:", user); // Log user object

  const handleOpenSettingsModal = () => setIsSettingsModalOpen(true);
  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false);

  // Check if a link is active based on current pathname
  const isActiveLink = (href) => {
    if (href === "/profile") {
      // For profile, check if current path starts with /profile
      return location.pathname.startsWith("/profile");
    }
    // For other links, check exact match or if pathname starts with href
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <>
      <header
        className={`${sticky ? "sticky top-0" : "relative"} z-50 w-full backdrop-blur-3xl theme-transition`}
      >
        <div className="w-full h-20 flex items-center justify-between px-6 lg:px-10">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center theme-transition">
            <Link
              to={"/"}
              className="flex items-center gap-2 text-xl font-bold text-primary theme-transition"
            >
              <RiFocus2Line className="h-8 w-8 theme-transition" />
              Zencode
            </Link>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-6 justify-center flex-none theme-transition">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm theme-transition ${
                  isActiveLink(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Theme Toggler and Auth */}
          <div className="flex-1 flex items-center justify-end gap-2 theme-transition">
            {/* <Link to={"/problems"}>
            <button className="flex flex-row justify-center items-center bg-primary hover:bg-primary/85 text-primary-foreground font-semibold !py-2 pl-4 pr-3 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer">
              Solve now
              <ChevronRight className="ml-2 h-4 w-4 theme-transition" />
            </button>
          </Link> */}
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
                <Link to={"signin"}>
                  <button
                    className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                      theme === "dark"
                        ? "bg-accent border border-border"
                        : "bg-card border border-border"
                    }`}
                  >
                    Sign In
                  </button>
                </Link>
                {/* Theme Toggler */}
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
                  className={`p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center hover:cursor-pointer ${
                    theme === "dark"
                      ? "bg-accent border border-border"
                      : "bg-card border border-border"
                  } ${isTransitioning ? "opacity-75" : ""}`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                    theme === "dark"
                      ? "bg-accent border border-border"
                      : "bg-card border border-border"
                  }`}
                  aria-label="Settings"
                  tabIndex={0}
                  onClick={handleOpenSettingsModal}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenSettingsModal();
                    }
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
                {/* Theme Toggler */}
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
                  className={`p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center hover:cursor-pointer ${
                    theme === "dark"
                      ? "bg-accent border border-border"
                      : "bg-card border border-border"
                  } ${isTransitioning ? "opacity-75" : ""}`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer"
                      tabIndex={0}
                      aria-label="User menu"
                    >
                      <Avatar className="h-8.5 w-8.5 theme-transition">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.name || user?.email || "User"}
                        />
                        <AvatarFallback className="text-sm border border-border text-muted-foreground theme-transition">
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
                  <AnimatePresence>
                    {dropdownOpen && (
                      <DropdownMenuContent
                        align="end"
                        className="min-w-56 mt-2 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        asChild
                        forceMount
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{
                            duration: 0.32,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          <DropdownMenuLabel className="theme-transition">
                            <div className="flex items-center text-lg gap-2 theme-transition">
                              <Avatar className="h-10 w-10 theme-transition">
                                <AvatarImage
                                  src={user?.avatar}
                                  alt={user?.name || user?.email || "User"}
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
                              <div className="flex flex-col theme-transition">
                                <span className="font-medium text-sm theme-transition">
                                  {user?.name || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground theme-transition">
                                  {user?.email}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="theme-transition" />
                          {/* <DropdownMenuItem
                        onClick={toggleTheme}
                        className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground theme-transition"
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
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4 text-primary theme-transition" />
                        ) : (
                          <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
                        )}
                        <span className="text-sm theme-transition">
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={logout}
                            className="text-destructive focus:text-destructive cursor-pointer theme-transition"
                            aria-label="Logout"
                          >
                            Log out
                          </DropdownMenuItem>
                        </motion.div>
                      </DropdownMenuContent>
                    )}
                  </AnimatePresence>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="theme-transition">
                <Menu className="h-6 w-6 text-foreground theme-transition" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background border-border text-foreground theme-transition"
            >
              <div className="flex flex-col gap-4 py-6 theme-transition">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium theme-transition ${
                      isActiveLink(link.href)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
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
                  className={`p-2 rounded-full border border-border bg-card hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center w-fit ${
                    isTransitioning ? "opacity-75" : ""
                  }`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-primary theme-transition" />
                  ) : (
                    <Moon className="h-5 w-5 text-muted-foreground theme-transition" />
                  )}
                  <span className="ml-2 text-sm theme-transition">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  className="text-lg font-medium text-foreground hover:text-primary justify-start theme-transition"
                >
                  Login
                </Button>
                <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold text-lg justify-start theme-transition">
                  Sign Up
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {/* Settings Modal - Rendered outside header for proper positioning */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm">
          <div
            className="bg-card border border-border text-foreground rounded-xl shadow-2xl max-w-md w-full mx-4 py-6 px-6 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
              onClick={handleCloseSettingsModal}
              aria-label="Close settings modal"
              tabIndex={0}
            >
              <LuX className="h-5 w-5" />
            </button>
            <div className="pr-8">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                Settings
              </h2>
              <div className="flex flex-col gap-3">
                <button
                  className="w-full text-left px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-accent-foreground font-medium"
                  tabIndex={0}
                  aria-label="Profile settings"
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-accent-foreground font-medium"
                  tabIndex={0}
                  aria-label="Preferences settings"
                >
                  Preferences
                </button>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-accent-foreground font-medium"
                  tabIndex={0}
                  aria-label="Theme settings"
                >
                  Theme
                </button>
                {/* Add more settings options here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
