
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Shield, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ApprovedAdmin {
  id: string;
  email: string;
  created_at: string;
  used: boolean;
}

const AdminManagement = () => {
  const [newEmail, setNewEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: approvedAdmins, isLoading } = useQuery({
    queryKey: ['approved-admins'],
    queryFn: async () => {
      // Use any type to bypass TypeScript errors for the approved_admins table
      const { data, error } = await (supabase as any)
        .from('approved_admins')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching approved admins:', error);
        throw error;
      }
      return data as ApprovedAdmin[];
    }
  });

  const inviteAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      // Use any type to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('approved_admins')
        .insert([{ email, invited_by: user?.id }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This email is already approved for admin access');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-admins'] });
      setNewEmail('');
      toast({ title: 'Admin invitation sent successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error sending invitation', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      // Use any type to bypass TypeScript errors
      const { error } = await (supabase as any)
        .from('approved_admins')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-admins'] });
      toast({ title: 'Admin approval removed successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error removing admin approval', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({ 
        title: 'Invalid email', 
        description: 'Please enter a valid email address',
        variant: 'destructive' 
      });
      return;
    }

    setIsInviting(true);
    try {
      await inviteAdminMutation.mutateAsync(newEmail);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (confirm('Are you sure you want to remove this admin approval?')) {
      await removeAdminMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading admin management...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Invite New Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter email to approve for admin access"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isInviting} className="adventure-button">
              {isInviting ? (
                <>Inviting...</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Approve Admin Access
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Approved Administrators ({approvedAdmins?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedAdmins?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No approved administrators yet</p>
          ) : (
            <div className="space-y-3">
              {approvedAdmins?.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{admin.email}</span>
                      <Badge variant={admin.used ? 'default' : 'secondary'}>
                        {admin.used ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Approved on {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAdmin(admin.id)}
                    disabled={admin.used && admin.email === user?.email}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
