import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FeatureCard from "../components/feature-card";
import TestimonialCard from "../components/testimonial-card";
import ProgressChart from "../components/progress-chart";
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
import { ChartBarInteractive } from "@/components/ui/chart-bar-interactive";
import Page from "@/components/Dashboard01";
import { ChartBarMultiple } from "@/components/chart-bar-multiple";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans hide-scrollbar">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Replicated Design */}
        <section className="relative h-[calc(90vh-4rem)] flex items-center justify-center !px-12 py-16 md:py-24 overflow-hidden">
          <div className="relative z-10 max-w-full mx-auto w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Left Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-3xl p-10 rounded-3xl border border-border bg-card">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary !text-sm font-medium mb-4">
                01 Purpose
              </span>
              <p className="font-poppins !text-3xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-foreground">
                Zencode: Where Code Meets{" "}
                <span className="text-primary">Focus</span>
              </p>
              <p className="!text-lg !md:text-xl text-muted-foreground mb-8">
                The distraction-free platform that helps you achieve deep work
                and master your skills.
              </p>
              <Button className="bg-primary hover:bg-amber-700 text-zinc-900 font-semibold !py-6 !px-6 rounded-full text-md shadow-lg transition-colors duration-300 group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-poppins !text-3xl !md:text-4xl font-bold text-center mb-12 text-primary">
              Features Designed for Focus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <section id="dashboard" className="py-16 md:py-24 px-4 bg-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4 text-primary">
              See Your Progress Unfold
            </h2>
            <p className="text-lg text-zinc-300 mb-12 max-w-2xl mx-auto">
              Our intuitive dashboard provides clear insights into your coding
              habits and skill development.
            </p>
            <Card className="flex justify-center items-center !border-none shadow-none bg-transparent rounded-xl">
              <CardContent className="p-6 md:p-8 max-w-5xl">
                {/* <ProgressChart /> */}
                {/* <ChartBarInteractive /> */}
                <ChartBarMultiple />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              What Developers Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <section className="py-16 md:py-24 px-4 bg-black text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6 text-primary">
              Ready to Achieve Deep Work?
            </h2>
            <p className="text-lg text-zinc-300 mb-8">
              Join Zencode today and experience a new level of coding focus and
              productivity.
            </p>
            <Button className="bg-primary hover:bg-amber-700 text-zinc-900 font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors duration-300">
              Start Coding Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
