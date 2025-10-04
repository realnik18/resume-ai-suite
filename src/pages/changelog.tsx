import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Bug, Shield, TrendingUp } from 'lucide-react';

const releases = [
  {
    version: '2.1.0',
    date: 'January 15, 2025',
    type: 'major',
    changes: [
      {
        type: 'feature',
        icon: Sparkles,
        title: 'AI Resume Improvement',
        description: 'Integrated OpenAI GPT-5 for intelligent resume optimization and ATS scoring',
      },
      {
        type: 'feature',
        icon: Zap,
        title: 'AI Cover Letter Generator',
        description: 'Generate tailored cover letters based on job postings and your resume',
      },
      {
        type: 'improvement',
        icon: TrendingUp,
        title: 'Enhanced Analytics',
        description: 'Real-time charts and insights for tracking your job search performance',
      },
    ],
  },
  {
    version: '2.0.0',
    date: 'December 20, 2024',
    type: 'major',
    changes: [
      {
        type: 'feature',
        icon: Zap,
        title: 'Supabase Integration',
        description: 'Full backend integration with real-time data synchronization',
      },
      {
        type: 'feature',
        icon: Shield,
        title: 'Authentication System',
        description: 'Secure user authentication with email/password and password reset',
      },
      {
        type: 'improvement',
        icon: TrendingUp,
        title: 'Job Application Tracker',
        description: 'Kanban-style board for managing applications across different stages',
      },
    ],
  },
  {
    version: '1.5.0',
    date: 'November 10, 2024',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        icon: Sparkles,
        title: 'Dark Mode',
        description: 'Added system-wide dark mode with theme toggle',
      },
      {
        type: 'improvement',
        icon: TrendingUp,
        title: 'Resume Templates',
        description: 'Added 5 new professional resume templates',
      },
      {
        type: 'fix',
        icon: Bug,
        title: 'PDF Export Fixes',
        description: 'Resolved formatting issues in PDF exports',
      },
    ],
  },
  {
    version: '1.4.0',
    date: 'October 5, 2024',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        icon: Zap,
        title: 'Keyboard Shortcuts',
        description: 'Added global keyboard shortcuts for faster navigation',
      },
      {
        type: 'improvement',
        icon: TrendingUp,
        title: 'Mobile Optimization',
        description: 'Improved responsive design for mobile and tablet devices',
      },
      {
        type: 'fix',
        icon: Bug,
        title: 'Performance Improvements',
        description: 'Optimized loading times and reduced bundle size by 30%',
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'September 1, 2024',
    type: 'major',
    changes: [
      {
        type: 'feature',
        icon: Sparkles,
        title: 'Initial Release',
        description: 'Launch of ApplyPro AI with resume builder, cover letter generator, and job tracker',
      },
    ],
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature':
      return 'default';
    case 'improvement':
      return 'secondary';
    case 'fix':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'feature':
      return 'New';
    case 'improvement':
      return 'Improved';
    case 'fix':
      return 'Fixed';
    default:
      return type;
  }
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-brand/80 text-brand-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Changelog</h1>
            <p className="text-xl text-brand-foreground/90">
              Stay updated with the latest features, improvements, and fixes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {releases.map((release) => (
            <div key={release.version} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-brand hidden md:block" />
              
              <div className="md:ml-12">
                {/* Version Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      Version {release.version}
                      {release.type === 'major' && (
                        <Badge className="bg-brand text-brand-foreground">Major Release</Badge>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground">{release.date}</p>
                  </div>
                </div>

                {/* Changes */}
                <div className="space-y-4">
                  {release.changes.map((change, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-brand/10 rounded-lg">
                            <change.icon className="h-5 w-5 text-brand" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{change.title}</CardTitle>
                              <Badge variant={getTypeColor(change.type)}>
                                {getTypeLabel(change.type)}
                              </Badge>
                            </div>
                            <CardDescription>{change.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-brand/5 to-brand/10 border-brand/20">
            <CardHeader className="text-center">
              <CardTitle>Stay Updated</CardTitle>
              <CardDescription>
                Subscribe to get notified about new features and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2">
                Subscribe
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
