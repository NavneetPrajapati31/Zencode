import { Code, Github, DiscIcon as Discord, Twitter } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-black py-12 px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and Description */}
        <div className="flex flex-col items-center">
          <a
            href="#"
            className="flex items-center gap-2 text-2xl font-bold text-primary mb-4"
          >
            {/* <Code className="h-7 w-7" /> */}
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
          </a>
          <p className="text-zinc-400 max-w-xs">
            Your calm, distraction-free platform for deep coding and skill
            improvement.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors duration-200"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#dashboard"
                className="hover:text-primary transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="hover:text-primary transition-colors duration-200"
              >
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">
            Connect With Us
          </h3>
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="#"
              aria-label="GitHub"
              className="text-zinc-400 hover:text-primary transition-colors duration-200"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="text-zinc-400 hover:text-primary transition-colors duration-200"
            >
              <Discord className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-zinc-400 hover:text-primary transition-colors duration-200"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
          <p className="text-zinc-400 mt-8">
            &copy; {new Date().getFullYear()} Zencode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
