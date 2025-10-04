import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Building2, ExternalLink, DollarSign, Calendar } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { listApplications, moveApplication, createApplication, updateApplication, type Application } from '@/lib/applications-api';
import { useToast } from '@/hooks/use-toast';
import { useGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts';

const statusColumns = [
  { id: 'saved', title: 'Saved', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-100 dark:bg-blue-800' },
  { id: 'interview', title: 'Interview', color: 'bg-yellow-100 dark:bg-yellow-800' },
  { id: 'offer', title: 'Offer', color: 'bg-green-100 dark:bg-green-800' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 dark:bg-red-800' },
] as const;

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
}

function ApplicationCard({ application, onEdit }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-background border border-dashed border-muted-foreground rounded-lg p-3"
      >
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab hover:shadow-md transition-shadow"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{application.role}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {application.company}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => onEdit(application)}>
                Edit Details
              </DropdownMenuItem>
              {application.link && (
                <DropdownMenuItem asChild>
                  <a href={application.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Job Posting
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {application.salary_range && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <DollarSign className="h-3 w-3" />
            {application.salary_range}
          </div>
        )}
        
        {application.applied_at && (
          <div className="text-xs text-muted-foreground">
            Applied: {new Date(application.applied_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, filterStatus]);

  const loadApplications = async () => {
    try {
      const data = await listApplications();
      setApplications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = statusColumns.find(col => col.id === overId);
    if (!targetColumn) return;

    const application = applications.find(app => app.id === activeId);
    if (!application || application.status === targetColumn.id) return;

    // Optimistic update
    const updatedApplications = applications.map(app =>
      app.id === activeId
        ? { ...app, status: targetColumn.id as Application['status'] }
        : app
    );
    setApplications(updatedApplications);

    // Update on server
    moveApplication(activeId, targetColumn.id as Application['status'])
      .then(() => {
        toast({
          title: 'Application moved',
          description: `Moved to ${targetColumn.title}`,
        });
      })
      .catch(() => {
        // Revert on error
        setApplications(applications);
        toast({
          title: 'Error',
          description: 'Failed to move application',
          variant: 'destructive',
        });
      });
  };

  const getApplicationsByStatus = (status: string) => {
    return filteredApplications.filter(app => app.status === status);
  };

  const draggedApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-5 gap-4">
          {statusColumns.map((col) => (
            <div key={col.id} className="space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
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
          <h1 className="text-3xl font-bold">Job Tracker</h1>
          <p className="text-muted-foreground">Track your job applications with our Kanban board</p>
        </div>
        <Button onClick={() => {
          setEditingApp({
            id: '',
            company: '',
            role: '',
            status: 'saved',
            user_id: '',
            created_at: '',
            updated_at: ''
          });
          setIsSheetOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusColumns.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No applications tracked"
          description="Start tracking your job applications to see them organized in this Kanban board"
          action={{
            label: "Add your first application",
            onClick: () => {
              setEditingApp({
                id: '',
                company: '',
                role: '',
                status: 'saved',
                user_id: '',
                created_at: '',
                updated_at: ''
              });
              setIsSheetOpen(true);
            }
          }}
        />
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-h-[500px]">
            {statusColumns.map((column) => {
              const columnApplications = getApplicationsByStatus(column.id);
              
              return (
                <div
                  key={column.id}
                  className="flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">{column.title}</h3>
                    <Badge variant="secondary">{columnApplications.length}</Badge>
                  </div>
                  
                  <SortableContext
                    items={columnApplications.map(app => app.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex-1 space-y-2">
                      {columnApplications.map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          onEdit={(app) => {
                            setEditingApp(app);
                            setIsSheetOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {draggedApplication ? (
              <ApplicationCard
                application={draggedApplication}
                onEdit={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit Application Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {editingApp ? 'Edit Application' : 'Add Application'}
            </SheetTitle>
          </SheetHeader>
          
          {editingApp && (
            <div className="space-y-4 mt-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editingApp.company}
                  onChange={(e) => setEditingApp({...editingApp, company: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={editingApp.role}
                  onChange={(e) => setEditingApp({...editingApp, role: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="link">Job Posting Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={editingApp.link || ''}
                  onChange={(e) => setEditingApp({...editingApp, link: e.target.value})}
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={editingApp.salary_range || ''}
                  onChange={(e) => setEditingApp({...editingApp, salary_range: e.target.value})}
                  placeholder="e.g., $80k - $120k"
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingApp.notes || ''}
                  onChange={(e) => setEditingApp({...editingApp, notes: e.target.value})}
                  placeholder="Add notes about this application..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={async () => {
                    try {
                      if (editingApp?.id) {
                        await updateApplication(editingApp.id, {
                          company: editingApp.company,
                          role: editingApp.role,
                          link: editingApp.link,
                          salary_range: editingApp.salary_range,
                          notes: editingApp.notes,
                        });
                        await loadApplications();
                      } else {
                        await createApplication({
                          company: editingApp?.company || '',
                          role: editingApp?.role || '',
                          link: editingApp?.link,
                          salary_range: editingApp?.salary_range,
                          notes: editingApp?.notes,
                        });
                        await loadApplications();
                      }
                      setIsSheetOpen(false);
                      toast({
                        title: editingApp?.id ? 'Application updated' : 'Application created',
                        description: 'Changes saved successfully',
                      });
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to save application',
                        variant: 'destructive',
                      });
                    }
                  }} 
                  className="flex-1"
                >
                  {editingApp?.id ? 'Save Changes' : 'Create Application'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSheetOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}