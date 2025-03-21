
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserRole, useAuth } from "@/context/AuthContext";
import { useFaculty } from "@/context/FacultyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Users, UserPlus, Edit, Trash } from "lucide-react";

export const UserManagement: React.FC = () => {
  const { faculty } = useFaculty();
  const { user } = useAuth();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | { id: string; name: string }>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "guest" as UserRole,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as UserRole,
    }));
  };

  const handleAddUser = () => {
    // Reset form and open dialog
    setFormData({
      name: "",
      email: "",
      department: "",
      role: "guest",
    });
    setEditMode(false);
    setIsAddUserDialogOpen(true);
  };

  const handleEditUser = (id: string, name: string) => {
    // Find faculty member data
    const facultyMember = faculty.find(f => f.id === id);
    if (facultyMember) {
      setFormData({
        name: facultyMember.name,
        email: facultyMember.email,
        department: facultyMember.department,
        role: "guest", // Default role since faculty data doesn't include role
      });
      setSelectedUser({ id, name });
      setEditMode(true);
      setIsAddUserDialogOpen(true);
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      toast({
        title: "User Deleted",
        description: `${name} has been removed from the system.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && selectedUser) {
      toast({
        title: "User Updated",
        description: `${formData.name}'s information has been updated.`,
      });
    } else {
      toast({
        title: "User Added",
        description: `${formData.name} has been added as a ${formData.role}.`,
      });
    }
    
    setIsAddUserDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Faculty Accounts</span>
            <span className="font-medium">{faculty.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">HOD Accounts</span>
            <span className="font-medium">1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Admin Accounts</span>
            <span className="font-medium">1</span>
          </div>
          
          <div className="space-y-2 mt-4">
            <Button 
              size="sm" 
              className="w-full" 
              onClick={handleAddUser}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
            
            <div className="max-h-48 overflow-y-auto mt-2">
              {faculty.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.department}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditUser(member.id, member.name)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteUser(member.id, member.name)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editMode ? "Update User" : "Add User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
