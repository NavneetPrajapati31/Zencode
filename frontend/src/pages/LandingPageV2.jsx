import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FeatureCard from "../components/feature-card";
import TestimonialCard from "../components/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Lightbulb,
  CalendarDays,
  Users,
  BarChart,
  ArrowRight,
} from "lucide-react";
import Page from "@/components/Dashboard01";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans hide-scrollbar theme-transition">
      {/* Navbar */}
      <Navbar sticky="true" />

      <main className="flex-1">
        {/* Hero Section - Replicated Design */}
        <section className="relative h-[calc(90vh-4rem)] flex items-center justify-center !px-12 py-16 md:py-24 overflow-hidden">
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
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-xs font-medium mb-4 theme-transition">
                  01 Purpose
                </span>
                <p className="!text-3xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-foreground theme-transition">
                  Zencode: Where Code Meets{" "}
                  <span className="text-primary">Focus</span>
                </p>
                <p className="!text-lg !md:text-xl text-muted-foreground mb-8 theme-transition">
                  The distraction-free platform that helps you achieve deep work
                  and master your skills.
                </p>
                <Link to={"/problems"}>
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold !py-6 !px-6 rounded-full text-md shadow-lg theme-transition group">
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
          className="py-16 md:py-24 px-4 bg-background theme-transition"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="!text-2xl !md:text-4xl font-semibold text-center mb-12 text-foreground theme-transition">
              Features Designed for Focus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={Code}
                title="Minimal Editor UI"
                description="A clean, intuitive coding interface with amber highlights, designed to keep your focus on the code, not the clutter."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Smart Focus Mode"
                description="Block out digital noise and notifications. Our intelligent focus mode helps you achieve peak concentration."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={CalendarDays}
                title="Daily Coding Streak"
                description="Track your progress and build consistent coding habits with our motivating daily streak tracker."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={Users}
                title="Real-Time Collaboration"
                description="Seamlessly pair program with teammates in real-time, sharing your screen and code with ease."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={BarChart}
                title="Progress Dashboard"
                description="Visualize your coding journey with clean, insightful charts and metrics to see your skills grow."
                image="/placeholder.svg?height=300&width=500"
              />
              <FeatureCard
                icon={Code}
                title="Integrated Debugger"
                description="Quickly identify and fix issues with our built-in, non-intrusive debugger."
                image="/placeholder.svg?height=300&width=500"
              />
            </div>
          </div>
        </section>

        {/* Progress Dashboard Showcase */}
        <section
          id="dashboard"
          className="py-16 md:py-24 px-4 bg-background theme-transition"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="!text-2xl !md:text-4xl font-semibold mb-4 text-foreground theme-transition">
              See Your Progress Unfold
            </h2>
            <p className="text-md text-muted-foreground mb-12 max-w-2xl mx-auto theme-transition">
              Our intuitive dashboard provides clear insights into your coding
              habits and skill development.
            </p>
            <Card className="flex justify-center items-center !border-none shadow-none bg-transparent rounded-xl theme-transition">
              <CardContent className="p-6 md:p-8 max-w-5xl"></CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-16 md:py-24 px-4 bg-background theme-transition"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="!text-2xl !md:text-4xl font-semibold text-center mb-12 text-foreground theme-transition">
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
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-background text-center theme-transition">
          <div className="!max-w-3xl mx-auto">
            <h2 className="!text-2xl !md:text-4xl font-semibold mb-6 text-foreground theme-transition">
              Ready to Achieve Deep Work?
            </h2>
            <p className="!text-md text-muted-foreground mb-8 theme-transition">
              Join Zencode today and experience a new level of coding focus and
              productivity.
            </p>
            <Link to={"/problems"}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold !py-6 !px-6 rounded-lg !text-md shadow-lg theme-transition">
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
