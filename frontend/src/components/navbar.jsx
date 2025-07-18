"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code } from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Testimonials", href: "#testimonials" },
    // { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-bold text-amber-600"
        >
          <Code className="h-6 w-6" />
          Zencode
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-zinc-300 hover:text-amber-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <Button
            variant="ghost"
            className="text-zinc-300 hover:text-amber-600"
          >
            Login
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-zinc-900 font-semibold">
            Sign Up
          </Button>
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
                  className="text-lg font-medium text-zinc-100 hover:text-amber-600 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <Button
                variant="ghost"
                className="text-lg font-medium text-zinc-100 hover:text-amber-600 justify-start"
              >
                Login
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700 text-zinc-900 font-semibold text-lg justify-start">
                Sign Up
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
