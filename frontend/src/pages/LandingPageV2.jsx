import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FeatureCard from "@/components/shared/feature-card";
import TestimonialCard from "@/components/shared/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Lightbulb,
  CalendarDays,
  Users,
  BarChart,
  ArrowRight,
  Sun,
} from "lucide-react";
import { FiLayers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-context-utils";
import { useAuth } from "@/components/auth/use-auth";

export default function LandingPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans hide-scrollbar theme-transition">
      {/* Navbar */}
      <Navbar sticky="true" />

      <main className="flex-1">
        {/* Hero Section - Replicated Design */}
        <section className="relative h-[calc(90vh-4rem)] flex items-center justify-center px-6 sm:px-12 py-16 md:py-24 overflow-hidden">
          <div className="relative z-10 max-w-full mx-auto w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Hero Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl p-0 lg:px-0 lg:py-0 rounded-2xl border border-border bg-card hover:scale-105 transition-all duration-300 theme-transition-override">
              {/* Browser-style header bar INSIDE the card */}
              <div
                className="w-full h-10 rounded-t-2xl bg-card flex items-center px-6 border-b border-border theme-transition"
                aria-label="Window controls"
                tabIndex={0}
              >
                <div className="flex space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-500 theme-transition"
                    aria-label="Close"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-yellow-500 theme-transition"
                    aria-label="Minimize"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-500 theme-transition"
                    aria-label="Maximize"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left w-full p-10 lg:px-16 lg:py-12">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-xs font-medium mb-3 theme-transition">
                  01 Purpose
                </span>
                <p className="text-2xl md:text-3xl font-bold tracking-tight mb-6 leading-tight text-foreground theme-transition">
                  Zencode: Where Code Meets{" "}
                  <span className="text-primary">Focus</span>
                </p>
                <p className="!text-lg !md:text-xl text-muted-foreground mb-8 theme-transition">
                  Focus deeply and grow steadily in a calm, distraction-free
                  coding space—designed to help you master new skills and build
                  lasting habits.
                </p>
                <Link to={user ? "/problems" : "/signup"}>
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold !py-5 !px-6 rounded-full text-md shadow-lg theme-transition group">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-12 md:py-24 px-6 sm:px-12 bg-background theme-transition"
        >
          <div className="max-w-6xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-xs font-medium mb-3 theme-transition">
              02 Features
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-3 text-foreground theme-transition">
              Designed to Maximize Your Focus
            </h2>
            <p className="text-md md:text-md text-muted-foreground mb-12 theme-transition">
              Discover the essential tools and thoughtful design that foster
              clarity, focus, and continuous growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={Code}
                title="Minimal Editor UI"
                description="A clean, intuitive coding interface with amber highlights, designed to keep your focus on the code, not the clutter."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={BarChart}
                title="Progress Dashboard"
                description="Track your coding journey and celebrate milestones with a clear, motivating overview of your achievements and growth."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={CalendarDays}
                title="Daily Coding Streak"
                description="Track your progress and build consistent coding habits with our motivating daily streak tracker."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={Sun}
                title="Customizable Coding Themes"
                description="Personalize your workspace with elegant light and dark themes for comfortable coding anytime."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={Code}
                title="Integrated Debugger"
                description="Quickly find and fix issues with our built-in, distraction-free debugger that keeps you focused on your code."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={FiLayers}
                title="Seamless Multi-Language Support"
                description="Easily switch between popular languages with built-in templates and smart syntax highlighting."
                image="/placeholder.svg?height=300&width=500"
              />
            </div>
          </div>
        </section>

        {/* Progress Dashboard Showcase */}
        <section
          id="dashboard"
          className="py-16 md:py-24 px-6 sm:px-12 bg-background theme-transition"
        >
          <div className="max-w-full mx-auto text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-xs font-medium mb-3 theme-transition">
              03 Dashboard
            </span>
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-foreground theme-transition">
              See Your Progress Unfold
            </h2>
            <p className="text-md text-muted-foreground mb-10 max-w-3xl mx-auto theme-transition">
              Our intuitive dashboard provides clear insights into your coding
              habits and skill development.
            </p>
            <Card className="flex justify-center items-center !border-none shadow-none bg-transparent rounded-xl theme-transition py-0">
              <CardContent className="p-0 max-w-full">
                <div className="grid">
                  <img
                    src="/Screenshot 2025-07-21 182018.png"
                    alt="ZenCode Dashboard Preview (Light)"
                    height={1180}
                    width={1180}
                    className={`mt-0.5 col-start-1 row-start-1 transition-opacity duration-300 ease-in ${
                      theme === "light" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/Screenshot 2025-07-21 181950.png"
                    alt="ZenCode Dashboard Preview (Dark)"
                    height={1180}
                    width={1180}
                    className={`col-start-1 row-start-1 transition-opacity duration-300 ease-in ${
                      theme === "dark" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section
          id="testimonials"
          className="py-16 md:py-24 px-4 bg-background theme-transition"
        >
          <div className="max-w-6xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-xs font-medium mb-3 theme-transition">
              04 Testimonials
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-12 text-foreground theme-transition">
              What Developers Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TestimonialCard
                quote="Zencode has transformed my coding sessions. The focus mode is a game-changer, and the clean UI helps me stay productive for hours."
                author="Jane Doe, Senior Developer"
                variant="default"
              />
              <TestimonialCard
                quote="Finally, a coding platform that understands the need for calm. The streak tracker keeps me motivated, and collaboration is seamless."
                author="John Smith, Freelance Coder"
                variant="gradient"
              />
              <TestimonialCard
                quote="As a mid-size business, we never thought advanced robotics would be accessible to us. Atlas changed that equation entirely with its versatility and ease of deployment."
                author="Jason Lee, CEO, Innovative Solutions Inc."
                variant="default"
              />
              <TestimonialCard
                quote="Atlas adapted to our lab protocols faster than any system we've used. It's like having another researcher who never gets tired and maintains perfect precision."
                author="Dr. Amara Patel, Lead Scientist, BioAdvance Research"
                variant="gradient"
              />
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6 sm:px-12 bg-background text-center theme-transition">
          <div className="max-w-3xl mx-auto items-center">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground theme-transition">
              Ready to Achieve Deep Work?
            </h2>
            <p className="!text-md text-muted-foreground mb-8 theme-transition">
              Join Zencode today and experience a new level of coding focus and
              productivity.
            </p>
            <Link to={user ? "/problems" : "/signup"}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold !py-6 !px-6 rounded-lg text-md shadow-lg theme-transition">
                Start Coding Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
