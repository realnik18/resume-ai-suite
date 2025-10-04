import { useState } from 'react';
import { Search, FileText, Zap, Target, Mail, MessageCircle, Book, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    title: 'Getting Started',
    icon: Zap,
    description: 'Learn the basics of ApplyPro AI',
    articles: 5,
  },
  {
    title: 'Resume Building',
    icon: FileText,
    description: 'Create ATS-optimized resumes',
    articles: 8,
  },
  {
    title: 'Job Applications',
    icon: Target,
    description: 'Track and manage applications',
    articles: 6,
  },
  {
    title: 'AI Features',
    icon: Zap,
    description: 'Use AI to improve your materials',
    articles: 4,
  },
];

const faqs = [
  {
    question: 'How do I create my first resume?',
    answer: 'Navigate to the Resumes page from the sidebar and click "Create Resume". Fill in your information in the resume editor, and our AI will help optimize it for ATS systems.',
  },
  {
    question: 'What is an ATS score?',
    answer: 'ATS (Applicant Tracking System) score indicates how well your resume will perform with automated screening systems used by employers. A score above 80% is excellent.',
  },
  {
    question: 'How does AI resume improvement work?',
    answer: 'Our AI analyzes your resume content, identifies areas for improvement, adds relevant keywords, enhances impact statements, and optimizes formatting for ATS compatibility.',
  },
  {
    question: 'Can I export my resume to PDF?',
    answer: 'Yes! In the resume editor, click the "Export" button to download your resume as a professional PDF document.',
  },
  {
    question: 'How do I track job applications?',
    answer: 'Go to the Job Tracker page and click "Add Application". You can then manage applications through different stages using our Kanban board interface.',
  },
  {
    question: 'What makes a good cover letter?',
    answer: 'A good cover letter is tailored to the specific job, highlights relevant achievements, demonstrates knowledge of the company, and shows enthusiasm for the role. Our AI can help generate customized cover letters.',
  },
  {
    question: 'How do I improve my interview rate?',
    answer: 'Focus on: 1) Optimizing your resume ATS score, 2) Tailoring applications to job descriptions, 3) Following up on applications, and 4) Ensuring your resume highlights quantifiable achievements.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard encryption and security practices. Your personal information and resume data are stored securely and never shared with third parties.',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-brand/80 text-brand-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-brand-foreground/90 mb-8">
              Find answers to your questions and learn how to make the most of ApplyPro AI
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help..."
                className="pl-12 h-12 bg-background text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand/10 rounded-lg">
                      <category.icon className="h-5 w-5 text-brand" />
                    </div>
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-brand/5 to-brand/10 border-brand/20">
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
              <CardDescription>
                Our support team is here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4 flex-col items-start gap-2">
                <Mail className="h-5 w-5 text-brand" />
                <div className="text-left">
                  <div className="font-semibold">Email Support</div>
                  <div className="text-sm text-muted-foreground">support@applypro.ai</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4 flex-col items-start gap-2">
                <MessageCircle className="h-5 w-5 text-brand" />
                <div className="text-left">
                  <div className="font-semibold">Live Chat</div>
                  <div className="text-sm text-muted-foreground">Available 9am-5pm EST</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4 flex-col items-start gap-2">
                <Book className="h-5 w-5 text-brand" />
                <div className="text-left">
                  <div className="font-semibold">Documentation</div>
                  <div className="text-sm text-muted-foreground">Detailed guides</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Video Tutorials */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="h-6 w-6" />
            Video Tutorials
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Getting Started with ApplyPro AI</CardTitle>
                <CardDescription>Learn the basics in 5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creating Your First Resume</CardTitle>
                <CardDescription>Step-by-step tutorial</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
