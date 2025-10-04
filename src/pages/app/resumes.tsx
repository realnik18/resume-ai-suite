import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, FileText, Target, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { listResumes, duplicateResume, deleteResume, createResume, type Resume } from '@/lib/resume-api';
import { useToast } from '@/hooks/use-toast';
import { useGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts';
import type { ColumnDef } from '@tanstack/react-table';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await listResumes();
      setResumes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load resumes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleCreateResume = async () => {
    try {
      const newResume = await createResume({
        title: 'Untitled Resume'
      });
      navigate(`/app/resumes/${newResume.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create resume',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (resume: Resume) => {
    try {
      const duplicated = await duplicateResume(resume.id);
      setResumes([duplicated, ...resumes]);
      toast({
        title: 'Resume duplicated',
        description: `Created a copy of "${resume.title}"`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate resume',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      const resume = resumes.find(r => r.id === resumeId);
      await deleteResume(resumeId);
      setResumes(resumes.filter(r => r.id !== resumeId));
      
      toast({
        title: 'Resume deleted',
        description: `"${resume?.title}" has been deleted`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resume',
        variant: 'destructive',
      });
    }
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "outline" => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'outline';
  };

  // Define table columns
  const columns: ColumnDef<Resume>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue('title')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'ats_score',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          ATS Score
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant={getScoreBadgeVariant(row.getValue('ats_score'))}>
          {row.getValue('ats_score')}%
        </Badge>
      ),
    },
    {
      accessorKey: 'last_improved',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Last Improved
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue('last_improved') as string | null;
        return (
          <span className="text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'last_exported',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Last Exported
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue('last_exported') as string | null;
        return (
          <span className="text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : '—'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const resume = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem asChild>
                <Link to={`/app/resumes/${resume.id}`}>View & Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteResumeId(resume.id)}
                className="text-destructive focus:text-destructive"
              >
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resumes</h1>
        </div>
        <div className="rounded-md border">
          <div className="animate-pulse p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Resumes</h1>
          <p className="text-muted-foreground">Create and manage your resumes</p>
        </div>
        <Button onClick={handleCreateResume}>
          <Plus className="mr-2 h-4 w-4" />
          Create Resume
        </Button>
      </div>

      {/* Data Table */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes found"
          description="Create your first resume to get started with ApplyPro AI"
          action={{
            label: "Create your first resume",
            onClick: handleCreateResume
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={resumes}
          searchKey="title"
          searchPlaceholder="Search resumes..."
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteResumeId}
        onOpenChange={() => setDeleteResumeId(null)}
        title="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteResumeId) {
            handleDelete(deleteResumeId);
            setDeleteResumeId(null);
          }
        }}
      />
    </div>
  );
}