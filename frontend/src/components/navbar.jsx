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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-context-utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ sticky = false }) {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Testimonials", href: "#testimonials" },
    // { name: "Pricing", href: "#pricing" },
  ];

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  console.log("Navbar user:", user); // Log user object

  return (
    <header
      className={`${sticky ? "sticky top-0" : "relative"} z-50 w-full backdrop-blur-3xl theme-transition`}
    >
      <div className="container mx-auto h-20 flex items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link
            to={"/"}
            className="flex items-center gap-2 text-xl font-bold text-primary theme-transition"
          >
            <RiFocus2Line className="h-8 w-8" />
            Zencode
          </Link>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 justify-center flex-none">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary theme-transition"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggler and Auth */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <Link to={"/problems"}>
            <button
              className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                theme === "dark"
                  ? "bg-accent border border-border"
                  : "bg-card border border-border"
              }`}
            >
              Solve now
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
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
                <button
                  className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                    theme === "dark"
                      ? "bg-accent border border-border"
                      : "bg-card border border-border"
                  }`}
                >
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer theme-transition"
                  tabIndex={0}
                  aria-label="User menu"
                >
                  <Avatar className="h-8.5 w-8.5">
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
                </button>
              </DropdownMenuTrigger>
              <AnimatePresence>
                {dropdownOpen && (
                  <DropdownMenuContent
                    align="end"
                    className="min-w-56 mt-2 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 theme-transition"
                    asChild
                    forceMount
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
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
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="theme-transition">
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
                  className="text-lg font-medium text-foreground hover:text-primary theme-transition"
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
  );
}
