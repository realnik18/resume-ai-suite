import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Sparkles, Target, Lightbulb, FileText, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getResume, improveResumeAI, updateResume, type Resume } from '@/lib/resume-api';
import { ResumeEditor } from '@/components/resume/resume-editor';

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImproving, setIsImproving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  useEffect(() => {
    if (resume) {
      setEditableTitle(resume.title);
    }
  }, [resume]);

  const loadResume = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const data = await getResume(id);
      if (data) {
        setResume(data);
      } else {
        toast({
          title: "Resume not found",
          description: "The requested resume could not be found.",
          variant: "destructive",
        });
        navigate('/app/resumes');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImproveWithAI = async () => {
    if (!resume) return;
    
    try {
      setIsImproving(true);
      const result = await improveResumeAI(resume.id, resume.content);
      
      // Reload the resume to get the updated content
      await loadResume();
      
      toast({
        title: "Resume improved!",
        description: `ATS score updated to ${result.ats_score}. Your resume has been automatically updated with improvements.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve resume with AI",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!resume || !id) return;
    
    try {
      await updateResume(id, { title: editableTitle });
      setResume(prev => prev ? { ...prev, title: editableTitle } : null);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Resume title updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resume title",
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = async (content: any) => {
    if (!resume || !id) return;
    
    await updateResume(id, { content });
    setResume(prev => prev ? { ...prev, content } : null);
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    toast({
      title: "Feature coming soon",
      description: `${format.toUpperCase()} export will be available soon`,
    });
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-96 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Resume not found</h3>
          <Button onClick={() => navigate('/app/resumes')}>
            Back to Resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/app/resumes')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resumes
          </Button>
          <div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="text-3xl font-bold h-12 text-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    autoFocus
                  />
                  <Button onClick={handleSaveTitle} size="sm">Save</Button>
                  <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{resume.title}</h1>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                ATS Score: <Badge variant="secondary" className={getScoreBadgeColor(resume.ats_score)}>
                  {resume.ats_score}%
                </Badge>
              </div>
              {resume.last_improved && (
                <span>Last improved: {new Date(resume.last_improved).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('docx')}>
            Export DOCX
          </Button>
          <Button onClick={handleImproveWithAI} disabled={isImproving} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {isImproving ? 'Improving...' : 'Improve with AI'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Content Editor */}
        <div className="lg:col-span-2">
          <ResumeEditor 
            content={resume.content || {
              personalInfo: { name: '', email: '', phone: '', location: '' },
              summary: '',
              experience: [],
              education: [],
              skills: []
            }}
            onSave={handleSaveContent}
          />
        </div>

        {/* AI Suggestions Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-medium mb-2">AI-Powered Improvements</h4>
                <p className="text-sm">Click "Improve with AI" to get personalized suggestions for your resume</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ATS Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Score</span>
                  <Badge variant="outline">{resume.ats_score}%</Badge>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>Your resume is being optimized for ATS systems</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Keyword density analysis</li>
                    <li>• Format compatibility</li>
                    <li>• Section organization</li>
                    <li>• Industry-specific optimization</li>
                  </ul>
                </div>
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
                Match to Job Posting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lightbulb className="mr-2 h-4 w-4" />
                Get AI Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}