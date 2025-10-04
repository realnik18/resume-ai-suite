import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, TrendingUp, Target, Building2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/app/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { listResumes, type Resume } from '@/lib/resume-api';
import { listApplications, type Application } from '@/lib/applications-api';
import { listCoverLetters, type CoverLetter } from '@/lib/cover-letters-api';
import { useAuth } from '@/hooks/use-auth';

export default function OverviewPage() {
  const { user } = useAuth();
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const [resumesData, applicationsData, lettersData] = await Promise.all([
        listResumes(),
        listApplications(),
        listCoverLetters()
      ]);
      
      setRecentResumes(resumesData.slice(0, 3));
      setRecentApplications(applicationsData.slice(0, 5));
      setCoverLetters(lettersData);
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = recentApplications.length;
  const activeResumes = recentResumes.length;
  const totalCoverLetters = coverLetters.length;
  const interviewCount = recentApplications.filter(app => app.status === 'interview').length;

  const kpis = [
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      icon: Target
    },
    {
      title: 'Interview Rate',
      value: totalApplications > 0 
        ? `${Math.round((interviewCount / totalApplications) * 100)}%` 
        : '0%',
      icon: TrendingUp
    },
    {
      title: 'Active Resumes',
      value: activeResumes.toString(),
      icon: FileText
    },
    {
      title: 'Cover Letters',
      value: totalCoverLetters.toString(),
      icon: Eye
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your job search progress and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Recent Resumes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/resumes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentResumes.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No resumes yet</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/app/resumes">
                    <Plus className="mr-1 h-3 w-3" />
                    Create Resume
                  </Link>
                </Button>
              </div>
            ) : (
              recentResumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{resume.title}</p>
                      <p className="text-xs text-muted-foreground">
                        ATS Score: {resume.ats_score || 0}%
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/app/resumes/${resume.id}`}>Edit</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Recent Applications</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/tracker">View Tracker</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No applications yet</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/app/tracker">
                    <Plus className="mr-1 h-3 w-3" />
                    Add Application
                  </Link>
                </Button>
              </div>
            ) : (
              recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{application.role}</p>
                      <p className="text-xs text-muted-foreground">{application.company}</p>
                    </div>
                  </div>
                  <Badge variant={
                    application.status === 'offer' ? 'default' :
                    application.status === 'interview' ? 'secondary' :
                    application.status === 'applied' ? 'outline' :
                    'destructive'
                  } className="text-xs">
                    {application.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/resumes">
                <Plus className="mr-2 h-4 w-4" />
                New Resume
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/cover-letters">
                <FileText className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/tracker">
                <Calendar className="mr-2 h-4 w-4" />
                Track Application
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}