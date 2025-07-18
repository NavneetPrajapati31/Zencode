"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code, Sun, Moon } from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-3xl">
      <div className="container mx-auto h-24 flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          to={"/"}
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          {/* <Code className="h-6 w-6" /> */}
          <RiFocus2Line className="h-10 w-10" />
          {/* <svg
            width="36"
            height="36"
            viewBox="0 0 100 100"
            aria-label="Petal Logo"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary rotate-135"
          >
            <path
              d="M50,50 Q20,20 50,5 Q35,35 50,50 Z"
              fill="currentColor"
              transform="rotate(0 50 50)"
            />

            <path
              d="M50,50 Q80,20 50,5 Q65,35 50,50 Z"
              fill="currentColor"
              transform="rotate(90 50 50)"
            />

            <path
              d="M50,50 Q80,80 95,50 Q65,65 50,50 Z"
              fill="currentColor"
              transform="rotate(180 50 50)"
            />

            <path
              d="M50,50 Q20,80 5,50 Q35,65 50,50 Z"
              fill="currentColor"
              transform="rotate(270 50 50)"
            />
          </svg> */}
          Zencode
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
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
            className="ml-2 p-2 rounded-full border border-border bg-card hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 flex items-center justify-center hover:cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          {!isAuthenticated ? (
            <>
              <Link to={"signin"}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                >
                  Login
                </Button>
              </Link>
              <Link to={"signup"}>
                <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full hover:cursor-pointer"
                  tabIndex={0}
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || user?.email || "User"}
                    />
                    <AvatarFallback>
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
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center text-lg gap-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || user?.email || "User"}
                      />
                      <AvatarFallback>
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
                      <span className="font-medium text-sm">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                  aria-label="Logout"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background border-border text-foreground"
          >
            <div className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              {/* Theme Toggler Mobile */}
              <button
                onClick={toggleTheme}
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
                className="p-2 rounded-full border border-border bg-card hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 flex items-center justify-center w-fit"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="ml-2 text-sm">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              <Button
                variant="ghost"
                className="text-lg font-medium text-foreground hover:text-primary justify-start"
              >
                Login
              </Button>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold text-lg justify-start">
                Sign Up
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
