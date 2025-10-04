import { useState, useEffect } from 'react';
import { MoreHorizontal, User, Crown, Building2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockUsers } from '@/lib/mock';
import { User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { ColumnDef } from '@tanstack/react-table';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${action}`,
      description: `${action} action performed on ${user?.name}`,
    });
  };

  const getPlanBadgeVariant = (plan: string): "default" | "secondary" | "outline" => {
    switch (plan) {
      case 'business':
        return 'default';
      case 'pro':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    return role === 'admin' ? 'default' : 'outline';
  };

  // Define table columns
  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            {row.original.avatarUrl ? (
              <img 
                src={row.original.avatarUrl} 
                alt={row.getValue('name')} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={getRoleBadgeVariant(row.getValue('role'))}>
          {row.getValue('role') === 'admin' && <Crown className="mr-1 h-3 w-3" />}
          {(row.getValue('role') as string).charAt(0).toUpperCase() + (row.getValue('role') as string).slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <Badge variant={getPlanBadgeVariant(row.getValue('plan'))}>
          {(row.getValue('plan') as string).charAt(0).toUpperCase() + (row.getValue('plan') as string).slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: 'seats',
      header: 'Seats',
      cell: ({ row }) => {
        const seats = row.getValue('seats') as number | undefined;
        return seats ? (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span>{seats}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'mrr',
      header: 'MRR',
      cell: ({ row }) => {
        const plan = row.original.plan;
        const seats = row.original.seats || 1;
        const mrr = plan === 'starter' ? 0 : plan === 'pro' ? 19 * seats : 49 * seats;
        
        return (
          <span className="font-medium">
            ${mrr}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'viewed')}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'impersonated')}>
                Impersonate User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'messaged')}>
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspended')}>
                Suspend Account
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
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="rounded-md border">
          <div className="animate-pulse p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and subscriptions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.plan === 'pro').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Users</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.plan === 'business').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total MRR</CardTitle>
            <span className="text-xs text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${users.reduce((total, user) => {
                const seats = user.seats || 1;
                const mrr = user.plan === 'starter' ? 0 : user.plan === 'pro' ? 19 * seats : 49 * seats;
                return total + mrr;
              }, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description="No user accounts have been created yet"
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search users..."
        />
      )}
    </div>
  );
}