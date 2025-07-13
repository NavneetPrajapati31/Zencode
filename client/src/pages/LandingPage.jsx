import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Trophy,
  Users,
  Zap,
  Shield,
  Target,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar className="backdrop-blur-md py-4">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodeArena
            </span>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex gap-8" justify="center">
          <NavbarItem>
            <Link
              to="#features"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="#competitions"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Competitions
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="#practice"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Practice
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="#leaderboard"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Leaderboard
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Button
              variant="light"
              className="text-gray-300 hover:text-blue-400 font-medium"
            >
              Sign In
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              endContent={<ChevronRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-900/30 text-blue-300 border-blue-700 hover:bg-blue-900/50 p-2">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 50,000+ developers worldwide
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 ">
              Master Coding Through
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent pb-2">
                Competitive Programming
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate online judge platform where developers compete,
              learn, and grow. Solve challenging problems, participate in
              contests, and climb the global leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                endContent={<Play className="w-3 h-3" />}
              >
                Start Coding Now
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="border-gray-600 text-gray-300 font-semibold px-8 py-3 hover:bg-gray-800 transition-all duration-300"
              >
                View Competitions
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  50K+
                </div>
                <div className="text-gray-400 font-medium">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  1M+
                </div>
                <div className="text-gray-400 font-medium">
                  Solutions Submitted
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  500+
                </div>
                <div className="text-gray-400 font-medium">
                  Practice Problems
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-400 font-medium">Platform Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to
              improve your coding skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-blue-800/50 rounded-xl flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Smart Code Editor
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Advanced code editor with syntax highlighting,
                  auto-completion, and real-time error detection
                </p>
              </CardBody>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-purple-800/50 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Live Competitions
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Participate in real-time coding contests and compete with
                  developers worldwide
                </p>
              </CardBody>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-green-800/50 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Secure Execution
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Docker-based sandboxed environment ensures safe and isolated
                  code execution
                </p>
              </CardBody>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-orange-800/50 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Instant Feedback
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Get immediate results with detailed test case analysis and
                  performance metrics
                </p>
              </CardBody>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border border-teal-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-teal-800/50 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Progress Tracking
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Monitor your improvement with detailed analytics and
                  performance insights
                </p>
              </CardBody>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-800/30">
              <CardBody className="p-0">
                <div className="w-12 h-12 bg-violet-800/50 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Global Community
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Connect with developers worldwide and learn from the best in
                  the community
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How CodeArena Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in minutes and begin your coding journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                1. Create Account
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sign up with your email and create your developer profile to get
                started
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                2. Choose Problems
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Browse our extensive library of coding problems or join live
                competitions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                3. Code & Compete
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Submit your solutions, get instant feedback, and climb the
                leaderboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">CodeArena</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The ultimate platform for competitive programming. Master coding
                through challenges, competitions, and continuous learning.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Problems
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Competitions
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Practice
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CodeArena. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
