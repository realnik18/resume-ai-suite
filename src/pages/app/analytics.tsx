import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Target, Send, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartCard } from '@/components/ui/chart-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { listApplications } from '@/lib/applications-api';
import { listResumes } from '@/lib/resume-api';
import { useAuth } from '@/hooks/use-auth';
import { useGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts';

interface MetricPoint {
  date: string;
  value: number;
}

// Simple line chart component
function SimpleLineChart({ data, dataKey, color = '#8884d8' }: { 
  data: MetricPoint[]; 
  dataKey: string; 
  color?: string; 
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // Show only last 14 data points for better visibility
  const displayData = data.slice(-14);

  return (
    <div className="h-64 w-full relative px-2">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-muted-foreground/20"
          />
        ))}
        
        {/* Data line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          points={displayData
            .map((point, index) => {
              const x = (index / (displayData.length - 1)) * 100;
              const normalizedValue = maxValue > 0 ? (point.value - minValue) / range : 0;
              const y = 100 - (normalizedValue * 80 + 10);
              return `${x},${y}`;
            })
            .join(' ')}
        />
        
        {/* Data points */}
        {displayData.map((point, index) => {
          const x = (index / (displayData.length - 1)) * 100;
          const normalizedValue = maxValue > 0 ? (point.value - minValue) / range : 0;
          const y = 100 - (normalizedValue * 80 + 10);
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                vectorEffect="non-scaling-stroke"
                className="hover:r-2 transition-all"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-muted-foreground">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue * 0.75)}</span>
        <span>{Math.round(maxValue * 0.5)}</span>
        <span>{Math.round(maxValue * 0.25)}</span>
        <span>0</span>
      </div>
    </div>
  );
}

function SimpleBarChart({ data, dataKey, color = '#8884d8' }: { 
  data: MetricPoint[]; 
  dataKey: string; 
  color?: string; 
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Show only last 14 data points for better visibility
  const displayData = data.slice(-14);

  return (
    <div className="h-64 w-full overflow-x-auto">
      <div className="flex items-end justify-start h-full gap-2 px-4 min-w-full">
        {displayData.map((point, index) => {
          const height = maxValue > 0 ? (point.value / maxValue) * 200 : 0;
          return (
            <div key={index} className="flex flex-col items-center min-w-[32px] flex-1 max-w-[60px]">
              <div className="w-full flex flex-col items-center justify-end h-[200px]">
                <span className="text-xs font-medium mb-1 text-foreground">{point.value}</span>
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${height}px`,
                    backgroundColor: color,
                    minHeight: point.value > 0 ? '8px' : '0px',
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 text-center whitespace-nowrap">
                {new Date(point.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<{ applications: MetricPoint[]; interviews: MetricPoint[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [applications, resumes] = await Promise.all([
        listApplications(),
        listResumes()
      ]);

      // Calculate date range
      const now = new Date();
      const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysBack);

      // Filter applications within date range
      const filteredApps = applications.filter(app => {
        const appDate = app.applied_at ? new Date(app.applied_at) : new Date(app.created_at);
        return appDate >= startDate;
      });

      // Group applications by date
      const applicationsByDate = new Map<string, number>();
      const interviewsByDate = new Map<string, number>();

      filteredApps.forEach(app => {
        const date = app.applied_at ? new Date(app.applied_at) : new Date(app.created_at);
        const dateKey = date.toISOString().split('T')[0];
        
        applicationsByDate.set(dateKey, (applicationsByDate.get(dateKey) || 0) + 1);
        
        if (app.status === 'interview' || app.status === 'offer') {
          interviewsByDate.set(dateKey, (interviewsByDate.get(dateKey) || 0) + 1);
        }
      });

      // Create time series data
      const createTimeSeries = (map: Map<string, number>) => {
        const series: MetricPoint[] = [];
        for (let i = daysBack - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          series.push({
            date: dateKey,
            value: map.get(dateKey) || 0
          });
        }
        return series;
      };

      setMetrics({
        applications: createTimeSeries(applicationsByDate),
        interviews: createTimeSeries(interviewsByDate)
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!metrics) return { totalApplications: 0, totalInterviews: 0, conversionRate: 0 };
    
    const totalApplications = metrics.applications.reduce((sum, point) => sum + point.value, 0);
    const totalInterviews = metrics.interviews.reduce((sum, point) => sum + point.value, 0);
    const conversionRate = totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0;
    
    return { totalApplications, totalInterviews, conversionRate };
  };

  const { totalApplications, totalInterviews, conversionRate } = calculateMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your job search performance and insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(value: '7d' | '30d' | '90d') => setDateRange(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Booked</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {conversionRate >= 15 ? '+5%' : '-2%'} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.8 days from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Applications Over Time"
          description={`Applications sent in the last ${dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'}`}
        >
          {metrics && (
            <SimpleLineChart
              data={metrics.applications}
              dataKey="value"
              color="hsl(var(--brand))"
            />
          )}
        </ChartCard>

        <ChartCard
          title="Interview Rate"
          description="Interviews booked vs applications sent"
        >
          {metrics && (
            <SimpleBarChart
              data={metrics.interviews}
              dataKey="value"
              color="hsl(var(--brand))"
            />
          )}
        </ChartCard>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Strong Interview Rate</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your {conversionRate}% interview rate is above the industry average of 12%
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Good
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Consistent Activity</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You've maintained steady application volume over the past month
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Excellent
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Resume Optimization</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Consider improving your ATS scores to increase response rates
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Opportunity
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Target className="mr-2 h-4 w-4" />
              Improve ATS Scores
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Detailed Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="mr-2 h-4 w-4" />
              Set Weekly Goals
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}