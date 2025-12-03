import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button";
import { HeaderSignInButton } from "@/components/header-sign-in";
import { CTASignInButton } from "@/components/cta-sign-in";
import {
  TrendingUp,
  Zap,
  Brain,
  BarChart3,
  Bell,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  DollarSign,
  LineChart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdGenius AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </a>
              <HeaderSignInButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI-Powered Google Ads Automation
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Google Ads Performance
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Save 15-20 hours per week with AI-powered insights, predictive analytics,
              and autonomous campaign optimization. Boost ROI by 25-40%.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
              <SignInButton />
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 transition-all hover:scale-105" asChild>
                <Link href="#features">
                  Learn More
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StatCard
              icon={<Clock className="w-8 h-8" />}
              value="70%"
              label="Less Time Monitoring"
              description="Automated insights save you time"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              value="25-40%"
              label="Better Performance"
              description="AI-optimized campaigns deliver results"
            />
            <StatCard
              icon={<DollarSign className="w-8 h-8" />}
              value="15-20hrs"
              label="Saved Per Week"
              description="Focus on strategy, not manual work"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dominate Google Ads</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful AI-driven features designed to maximize your ROI and minimize your workload
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Predictive Intelligence"
              description="AI forecasts campaign performance and recommends budget allocation for maximum ROI based on historical data and trends."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Autonomous Optimization"
              description="Continuous bid adjustments, keyword management, and ad testing without manual intervention. Works 24/7 for you."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8" />}
              title="Smart Alerts"
              description="Real-time notifications when performance deviates from expected patterns. Never miss an opportunity or issue."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Cross-platform attribution, cohort analysis, and natural language queries to understand your data deeply."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Campaign Builder"
              description="AI-guided campaign creation with automated keyword research and ad copy generation powered by Claude."
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<LineChart className="w-8 h-8" />}
              title="Performance Forecasting"
              description="Predict seasonal trends and optimize for upcoming market changes before they happen."
              gradient="from-pink-500 to-rose-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple setup, powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Connect Your Account"
              description="Link your Google Ads and Analytics accounts with one click. Secure OAuth authentication."
            />
            <StepCard
              number="2"
              title="AI Analyzes Your Data"
              description="Our AI agent reviews your campaigns, identifies opportunities, and creates optimization plans."
            />
            <StepCard
              number="3"
              title="Watch Performance Soar"
              description="Approve recommendations or enable autopilot mode. See results within days."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Loved by Marketing Teams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AdGenius AI cut our campaign management time in half while improving ROAS by 35%. Game changer!"
              author="Sarah Chen"
              role="Marketing Director"
              company="TechStart Inc."
            />
            <TestimonialCard
              quote="The predictive analytics are incredible. We can now allocate budget proactively instead of reactively."
              author="Mike Rodriguez"
              role="PPC Manager"
              company="Growth Co."
            />
            <TestimonialCard
              quote="Finally, a tool that actually delivers on its AI promises. The autonomous optimization is pure magic."
              author="Emily Taylor"
              role="CMO"
              company="SaaS Labs"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Google Ads?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of marketers saving time and boosting performance with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTASignInButton />
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 transition-all hover:scale-105" asChild>
              <Link href="#features">
                Learn More
                <Sparkles className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <p className="text-blue-100 mt-6 text-sm">
            No credit card required • Start optimizing immediately
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AdGenius AI</span>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © 2024 AdGenius AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  description,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="text-center text-white transform hover:scale-105 transition-transform">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
        {icon}
      </div>
      <div className="text-5xl font-bold mb-2">{value}</div>
      <div className="text-xl font-semibold mb-2">{label}</div>
      <div className="text-blue-100">{description}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl mb-6 text-white transform group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {number}
        </div>
        <div className="ml-6">
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="text-4xl text-blue-600 mb-4">"</div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {quote}
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <div className="font-semibold text-gray-900 dark:text-white">
            {author}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  );
}
