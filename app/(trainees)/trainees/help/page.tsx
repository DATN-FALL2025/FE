"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, HelpCircle, FileText, Upload } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "What document formats are accepted?",
      answer:
        "We accept PDF, JPG, and PNG formats. PDFs must be under 5MB, and images must be under 1MB. Make sure your documents are clear and readable.",
    },
    {
      question: "How long does document review take?",
      answer:
        "Document review typically takes 2-3 business days. You will receive a notification once your documents have been reviewed. Urgent cases may be processed faster.",
    },
    {
      question: "What if my document is rejected?",
      answer:
        "If your document is rejected, you will receive a detailed reason via notification and email. You can resubmit a corrected version immediately. Make sure to address all the issues mentioned in the rejection reason.",
    },
    {
      question: "Can I update a document after approval?",
      answer:
        "Once a document is approved, you cannot modify it directly. If you need to update an approved document, please contact the Academic Staff or administration for assistance.",
    },
    {
      question: "What are the photo requirements for 3x4 photos?",
      answer:
        "Your 3x4 photo must have a white background, be recent (taken within the last 6 months), and show your face clearly without sunglasses or hats. The file size should be under 1MB.",
    },
    {
      question: "What is the TOEIC score requirement?",
      answer:
        "For most aviation programs, a minimum TOEIC score of 600 is required. Your TOEIC certificate must be valid and issued within the last 2 years.",
    },
    {
      question: "How do I know if my medical certificate is valid?",
      answer:
        "Your medical certificate must be issued by a certified aviation medical examiner and valid for at least 6 months from the date of submission. It should include all required health checks for your training program.",
    },
    {
      question: "Can I submit documents on mobile?",
      answer:
        "Yes! Our platform is fully responsive and works on mobile devices. You can upload and track your documents using our mobile-friendly interface or through our dedicated mobile app.",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Find answers to common questions or contact our support team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - FAQs */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Document Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about required documents
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Upload Tutorial</h3>
                <p className="text-sm text-muted-foreground">
                  How to upload documents
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Watch step-by-step guides
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to the most common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">support@idmawa.edu.vn</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">+84 123 456 789</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Live Chat</p>
                  <p className="text-sm font-medium">Available 8AM - 5PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Well respond within 24 hours
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What do you need help with?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={5}
                />
              </div>

              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

