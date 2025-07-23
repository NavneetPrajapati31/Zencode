import { Github, DiscIcon as Discord, Twitter } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAuth } from "@/components/auth/use-auth";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-background py-8 px-8 sm:px-12 lg:px-20 border-t border-border theme-transition">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 max-w-md space-y-4 flex flex-col items-start">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-bold text-primary mb-3 theme-transition"
            aria-label="Home"
            tabIndex={0}
          >
            <RiFocus2Line className="h-6 w-6" />
            Zencode
          </a>
          <p className="text-muted-foreground text-sm text-left max-w-xs md:max-w-sm theme-transition">
            A calm, distraction-free coding platform for deep focus and skill
            growth.
          </p>
          <div className="flex gap-4 mt-0">
            <a
              href="https://github.com/navneetPrajapati31"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              tabIndex={0}
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/navneet-prajapati-640345290"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              tabIndex={0}
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
            <a
              href="/"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              tabIndex={0}
            >
              <FaXTwitter className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="space-y-4 flex flex-col items-start">
          <h3 className="text-sm font-medium text-foreground theme-transition">
            Product
          </h3>
          <a
            href={user ? "/problems" : "/signup"}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm mb-1"
            tabIndex={0}
          >
            Problems
          </a>
          <a
            href={user ? "/leaderboard" : "/signup"}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm mb-1"
            tabIndex={0}
          >
            Leaderboard
          </a>
          <a
            href={user ? "/profile" : "/signup"}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
            tabIndex={0}
          >
            Profile
          </a>
        </div>
        {/* <div className="space-y-4 flex flex-col items-start">
          <h3 className="text-sm font-medium text-foreground theme-transition">
            Resources
          </h3>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm mb-1"
            tabIndex={0}
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm mb-1"
            tabIndex={0}
          >
            Discord
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
            tabIndex={0}
          >
            Contact
          </a>
        </div> */}
        <div className="space-y-4"></div>
      </div>
      <div className="border-t border-border mt-6 w-full" />
      <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start pt-6 px-0 text-xs text-muted-foreground theme-transition">
        <span className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Zencode. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
