import { Code, Github, DiscIcon as Discord, Twitter } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-background py-12 px-12 border-t border-border theme-transition">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and Description */}
        <div className="flex flex-col items-center">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-bold text-primary mb-4 theme-transition"
          >
            {/* <Code className="h-7 w-7" /> */}
            <RiFocus2Line className="h-7 w-7" />
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
          </a>
          <p className="text-muted-foreground text-sm max-w-sm theme-transition">
            Your calm, distraction-free platform for deep coding and skill
            improvement.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold text-foreground mb-4 theme-transition">
            Quick Links
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors duration-200 theme-transition"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#dashboard"
                className="hover:text-primary transition-colors duration-200 theme-transition"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="hover:text-primary transition-colors duration-200 theme-transition"
              >
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold text-foreground mb-4 theme-transition">
            Connect With Us
          </h3>
          <div className="flex justify-center md:justify-start gap-4 text-sm">
            <a
              href="#"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 theme-transition"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 theme-transition"
            >
              <Discord className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 theme-transition"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-8 theme-transition">
            &copy; {new Date().getFullYear()} Zencode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
