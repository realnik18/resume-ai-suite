import { useState, useEffect } from 'react';
import { Plus, FileText, Wand2, Search, MoreHorizontal, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { listCoverLetters, createCoverLetter, deleteCoverLetter, generateCoverLetterAI, type CoverLetter } from '@/lib/cover-letters-api';
import { listResumes, type Resume } from '@/lib/resume-api';
import { useToast } from '@/hooks/use-toast';
import type { ColumnDef } from '@tanstack/react-table';

export default function CoverLettersPage() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [jobPosting, setJobPosting] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('professional');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lettersData, resumesData] = await Promise.all([
        listCoverLetters(),
        listResumes()
      ]);
      setCoverLetters(lettersData);
      setResumes(resumesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedResume || !jobPosting || !company || !role) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const resume = resumes.find(r => r.id === selectedResume);
      if (!resume) {
        throw new Error('Selected resume not found');
      }

      const result = await generateCoverLetterAI(
        jobPosting,
        resume.content,
        company,
        role,
        tone
      );

      if (result.success && result.content) {
        const newCoverLetter = await createCoverLetter({
          title: `Cover Letter - ${company} ${role}`,
          content: result.content,
          job_posting: jobPosting,
          company,
          role,
          tone,
        });

        setCoverLetters([newCoverLetter, ...coverLetters]);
        setIsGeneratorOpen(false);
        
        // Reset form
        setSelectedResume('');
        setJobPosting('');
        setCompany('');
        setRole('');
        setTone('professional');

        toast({
          title: 'Cover Letter Generated',
          description: 'Your AI-generated cover letter is ready!',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: result.error || 'Failed to generate cover letter',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate cover letter',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoverLetter(id);
      setCoverLetters(coverLetters.filter(letter => letter.id !== id));
      toast({
        title: 'Cover Letter Deleted',
        description: 'Cover letter has been removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete cover letter',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to Clipboard',
      description: 'Cover letter content has been copied',
    });
  };

  const columns: ColumnDef<CoverLetter>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => row.getValue('company') || '-',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => row.getValue('role') || '-',
    },
    {
      accessorKey: 'tone',
      header: 'Tone',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue('tone')}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const coverLetter = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyToClipboard(coverLetter.content)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(coverLetter.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-20 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Cover Letters</h1>
          <p className="text-muted-foreground">Generate AI-powered cover letters tailored to job postings</p>
        </div>
        
        <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate AI Cover Letter</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Select Resume</Label>
                  <Select value={selectedResume} onValueChange={setSelectedResume}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a resume" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter job role"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobPosting">Job Posting *</Label>
                <Textarea
                  id="jobPosting"
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  placeholder="Paste the job posting or job description here..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsGeneratorOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {coverLetters.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No cover letters yet"
          description="Generate your first AI-powered cover letter tailored to a specific job posting"
          action={{
            label: "Generate your first cover letter",
            onClick: () => setIsGeneratorOpen(true)
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={coverLetters}
          searchKey="title"
          searchPlaceholder="Search cover letters..."
        />
      )}
    </div>
  );
}