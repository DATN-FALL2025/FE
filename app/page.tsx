"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  FileCheck,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
  Search,
  Bell,
  Plane,
  Users,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Upload,
      title: "Easy Document Upload",
      description: "Drag & drop your admission documents with automatic format validation and virus scanning.",
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Automated Validation",
      description: "Smart system automatically checks formats, sizes, and requirements before submission.",
      color: "bg-yellow-500",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor your document status with live updates and deadline reminders.",
      color: "bg-green-500",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-level security with encrypted storage and comprehensive audit trails.",
      color: "bg-purple-500",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get instant alerts for approvals, rejections, and approaching deadlines.",
      color: "bg-orange-500",
    },
    {
      icon: BarChart3,
      title: "Progress Dashboard",
      description: "Visual analytics showing your submission progress and completion percentage.",
      color: "bg-pink-500",
    },
  ];

  const programs = [
    {
      icon: Plane,
      title: "Pilot Training",
      description: "Professional pilot certification program with comprehensive flight training.",
      badge: "Most Popular",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Users,
      title: "Cabin Crew",
      description: "Elite cabin crew training for exceptional customer service excellence.",
      badge: "New",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: GraduationCap,
      title: "Aviation Maintenance",
      description: "Technical expertise in aircraft maintenance and engineering systems.",
      badge: "High Demand",
      color: "from-orange-500 to-orange-700",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Account",
      description: "Register with your email and student information to access the portal.",
    },
    {
      step: "02",
      title: "View Requirements",
      description: "Check your program's document requirements and submission guidelines.",
    },
    {
      step: "03",
      title: "Upload Documents",
      description: "Submit your documents with our easy drag-and-drop interface.",
    },
    {
      step: "04",
      title: "Track Progress",
      description: "Monitor review status and receive notifications for any updates.",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Students Enrolled" },
    { value: "98%", label: "Approval Rate" },
    { value: "24hrs", label: "Avg Review Time" },
    { value: "100%", label: "Secure Platform" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">IDMAWA</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Aviation Academy</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              About
            </Link>
            <Link href="/programs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              Programs
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
              Contact
            </Link>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              ✈️ Aviation Academy Admission Portal
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Streamline Your Aviation Academy Admission
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload, track, and manage your admission documents with ease. Our automated workflow ensures fast, secure, and efficient document processing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="text-lg h-12 px-8" asChild>
                <Link href="/signup">
                  Start Your Application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link href="#how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Smooth Admission
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines automation, security, and user-friendly design to simplify your document submission process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with our simple 4-step process to complete your admission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-20 w-full h-0.5 bg-primary/20" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Programs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Aviation Training Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our world-class aviation programs designed to prepare you for a successful career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="border-0 shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${program.color} p-8 text-white relative`}>
                    <Badge className="absolute top-4 right-4 bg-white text-primary border-0 font-semibold">
                      {program.badge}
                    </Badge>
                    <Icon className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                    <Button variant="outline" className="w-full group hover:bg-primary hover:text-white transition-colors">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 md:p-16 text-center text-white relative">
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Ready to Start Your Aviation Career?
                </h2>
                <p className="text-lg md:text-xl text-white/90">
                  Join thousands of students who have successfully completed their admission process with IDMAWA.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" variant="secondary" className="text-lg h-12 px-8" asChild>
                    <Link href="/signup">
                      Apply Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent text-white border-white hover:bg-white/10" asChild>
                    <Link href="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-lg p-2">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">IDMAWA</h1>
                  <p className="text-xs text-muted-foreground">Aviation Academy</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamlining aviation academy admissions with modern technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/programs" className="hover:text-primary transition-colors">Programs</Link></li>
                <li><Link href="/admissions" className="hover:text-primary transition-colors">Admissions</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@idmawa.edu.vn</li>
                <li>Phone: +84 123 456 789</li>
                <li>Hours: 8AM - 5PM (Mon-Fri)</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 IDMAWA - Aviation Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
