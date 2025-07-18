"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Testimonials", href: "#testimonials" },
    // { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-3xl">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          {/* <Code className="h-6 w-6" /> */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 100 100"
            aria-label="Petal Logo"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary rotate-135"
          >
            {/* Top Left Petal */}
            <path
              d="M50,50 Q20,20 50,5 Q35,35 50,50 Z"
              fill="currentColor"
              transform="rotate(0 50 50)"
            />
            {/* Top Right Petal */}
            <path
              d="M50,50 Q80,20 50,5 Q65,35 50,50 Z"
              fill="currentColor"
              transform="rotate(90 50 50)"
            />
            {/* Bottom Right Petal */}
            <path
              d="M50,50 Q80,80 95,50 Q65,65 50,50 Z"
              fill="currentColor"
              transform="rotate(180 50 50)"
            />
            {/* Bottom Left Petal */}
            <path
              d="M50,50 Q20,80 5,50 Q35,65 50,50 Z"
              fill="currentColor"
              transform="rotate(270 50 50)"
            />
          </svg>
          Zencode
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-zinc-300 hover:text-primary transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <Link to={"signin"}>
            <Button
              variant="ghost"
              className="text-zinc-300 hover:text-primary"
            >
              Login
            </Button>
          </Link>
          <Link to={"signup"}>
            <Button className="bg-primary hover:bg-amber-700 text-zinc-900 font-semibold">
              Sign Up
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-zinc-100" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          >
            <div className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-zinc-100 hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <Button
                variant="ghost"
                className="text-lg font-medium text-zinc-100 hover:text-primary justify-start"
              >
                Login
              </Button>
              <Button className="bg-primary hover:bg-amber-700 text-zinc-900 font-semibold text-lg justify-start">
                Sign Up
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
