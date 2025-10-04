import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, Target, Zap, TrendingUp, Shield, Clock, Sparkles, CheckCircle2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import sarahPhoto from '@/assets/testimonial-sarah.jpg';
import michaelPhoto from '@/assets/testimonial-michael.jpg';
import emilyPhoto from '@/assets/testimonial-emily.jpg';

const features = [
  {
    icon: Target,
    title: 'AI Resume Optimization',
    description: 'Advanced ATS analysis that optimizes your resume for maximum interview callbacks',
    stats: '3x more interviews'
  },
  {
    icon: Zap,
    title: 'Smart Cover Letters',
    description: 'Generate perfectly tailored cover letters in seconds, customized for each application',
    stats: '90% time saved'
  },
  {
    icon: BarChart3,
    title: 'Application Tracker',
    description: 'Visual Kanban board to organize and track every application with full analytics',
    stats: '100% organized'
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'Higher Success Rate',
    description: 'Our users see 3x more interview invitations compared to traditional applications'
  },
  {
    icon: Clock,
    title: 'Save Hours Weekly',
    description: 'Automate repetitive tasks and focus on interview preparation instead'
  },
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description: 'Guaranteed to pass Applicant Tracking Systems used by 99% of companies'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Intelligence',
    description: 'Cutting-edge AI technology trained on millions of successful applications'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'SC',
    photo: sarahPhoto,
    content: 'ApplyPro AI completely transformed my job search. I went from 2% response rate to landing 15 interviews in just 3 weeks. The ATS optimization is a game-changer.',
    rating: 5,
    results: '+650% interviews'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Marketing Director',
    company: 'Amazon',
    avatar: 'MR',
    photo: michaelPhoto,
    content: 'The AI-generated cover letters are indistinguishable from ones I would spend hours crafting. Saved me 20+ hours per week during my job search.',
    rating: 5,
    results: '20h saved weekly'
  },
  {
    name: 'Emily Johnson',
    role: 'Lead Product Designer',
    company: 'Meta',
    avatar: 'EJ',
    photo: emilyPhoto,
    content: 'I was skeptical at first, but the results speak for themselves. Got my dream job at Meta thanks to ApplyPro AI. Worth every penny.',
    rating: 5,
    results: 'Dream job landed'
  }
];

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '85%', label: 'Interview Rate' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '4.9/5', label: 'User Rating' }
];

const pricingFeatures = [
  'Unlimited AI-optimized resumes',
  'Unlimited cover letter generation',
  'Advanced ATS scoring',
  'Application tracker & analytics',
  'Export to PDF & DOCX',
  'Priority email support',
  '30-day money-back guarantee'
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-brand-radial animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <Badge className="badge-premium text-sm px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted by 10,000+ professionals worldwide
              </Badge>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in-up tracking-tight">
              Land your dream job with{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                AI-powered resumes
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Professional ATS-optimized resumes, personalized cover letters, and intelligent tracking—everything you need to get hired faster.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
              <Link to="/auth/sign-up">
                <Button size="lg" className="shadow-brand-lg text-base px-8 py-6 h-auto group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto hover-lift">
                Watch Demo
              </Button>
            </div>
            
            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-brand mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to give you an unfair advantage in your job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-lift group border-2">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 text-brand font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Two Column */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-brand-radial rounded-3xl flex items-center justify-center float">
                <div className="text-center p-8">
                  <div className="text-7xl font-bold text-brand mb-4">3x</div>
                  <div className="text-2xl font-semibold">More Interviews</div>
                  <div className="text-muted-foreground mt-2">Than traditional applications</div>
                </div>
              </div>
            </div>
            
            {/* Right: Benefits */}
            <div>
              <Badge variant="outline" className="mb-4">Why Choose ApplyPro AI</Badge>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Get results that matter
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals who've accelerated their careers with our AI-powered platform
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Cards */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Loved by professionals worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how ApplyPro AI has transformed careers and landed dream jobs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card hover-lift border-2">
                <CardContent className="p-8">
                  {/* Header with Author and Rating */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-brand/20">
                        <AvatarImage src={testimonial.photo} alt={testimonial.name} />
                        <AvatarFallback className="bg-gradient-brand text-white font-semibold text-lg">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-sm font-semibold text-brand">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <p className="text-base leading-relaxed mb-4 text-foreground/90">"{testimonial.content}"</p>
                  
                  {/* Result Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-bold">
                    <TrendingUp className="h-4 w-4" />
                    {testimonial.results}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card border-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-brand opacity-5" />
              <CardContent className="relative p-12">
                <div className="text-center mb-8">
                  <Badge className="badge-premium mb-4">Limited Time Offer</Badge>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                    Start landing interviews today
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join Pro for just <span className="text-4xl font-bold text-brand">$29</span>/month
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {pricingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-brand flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Link to="/auth/sign-up">
                    <Button size="lg" className="shadow-brand-lg text-lg px-12 py-6 h-auto group">
                      Start Your Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-4">
                    No credit card required • Cancel anytime • 30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              Ready to transform your job search?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of professionals who've already upgraded their applications and landed their dream jobs with ApplyPro AI.
            </p>
            <Link to="/auth/sign-up">
              <Button size="lg" className="shadow-brand-lg text-lg px-12 py-6 h-auto group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
