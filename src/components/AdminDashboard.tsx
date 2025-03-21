
import React, { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { useResource } from "@/context/ResourceContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  Clock, 
  Database, 
  Edit2, 
  Settings, 
  Shield, 
  User, 
  UserPlus, 
  Users
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const AdminDashboard: React.FC = () => {
  const { faculty } = useFaculty();
  const { resources } = useResource();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{title: string; content: React.ReactNode}>({
    title: "",
    content: null
  });
  const navigate = useNavigate();

  const handleSystemSettings = () => {
    toast({
      title: "System Settings",
      description: "Opening system settings panel",
    });
    
    setDialogContent({
      title: "System Settings",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">System Configuration</h3>
              <div className="text-sm text-muted-foreground">
                Configure global system settings and preferences.
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Integration Settings</h3>
              <div className="text-sm text-muted-foreground">
                Manage external service integrations and API keys.
              </div>
            </div>
          </div>
          <Button className="w-full">Apply Changes</Button>
        </div>
      )
    });
    
    setIsDialogOpen(true);
  };

  const handleManageUsers = () => {
    toast({
      title: "User Management",
      description: "Opening user management panel",
    });
    
    setDialogContent({
      title: "User Management",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {faculty.map((member, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.department}</div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
          <Button className="w-full">Add New User</Button>
        </div>
      )
    });
    
    setIsDialogOpen(true);
  };

  const handleEditSchedule = () => {
    toast({
      title: "Edit Faculty Schedules",
      description: "Navigating to faculty schedule management",
    });
    navigate('/faculty');
  };

  const handleAdjustWorkload = () => {
    toast({
      title: "Workload Limits",
      description: "Opening workload adjustment panel",
    });
    
    setDialogContent({
      title: "Adjust Workload Limits",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Teaching Hours</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">Max:</span>
                <input type="number" className="border rounded px-2 py-1 w-16" defaultValue={20} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Lab Hours</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">Max:</span>
                <input type="number" className="border rounded px-2 py-1 w-16" defaultValue={15} />
              </div>
            </div>
          </div>
          <Button className="w-full">Save Limits</Button>
        </div>
      )
    });
    
    setIsDialogOpen(true);
  };

  const handleSyncCalendar = async () => {
    toast({
      title: "Google Calendar",
      description: "Attempting to sync with Google Calendar",
    });
    
    try {
      await googleCalendarService.initialize();
      const isAuthenticated = googleCalendarService.isAuthenticated();
      
      if (!isAuthenticated) {
        const success = await googleCalendarService.signIn();
        if (success) {
          toast({
            title: "Connected",
            description: "Successfully connected to Google Calendar",
          });
        } else {
          throw new Error("Failed to authenticate with Google");
        }
      } else {
        // Refresh events
        const events = await googleCalendarService.getEvents();
        toast({
          title: "Synced",
          description: `Successfully synced ${events.length} events from Google Calendar`,
        });
      }
    } catch (error) {
      console.error("Calendar sync failed:", error);
      toast({
        title: "Sync Failed",
        description: "Could not sync with Google Calendar",
        variant: "destructive",
      });
    }
  };

  const handleBulkImport = () => {
    toast({
      title: "Bulk Faculty Import",
      description: "Opening faculty import panel",
    });
    
    setDialogContent({
      title: "Bulk Faculty Import",
      content: (
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop a CSV file or click to browse
              </p>
              <Button variant="outline" size="sm">Select File</Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Upload a CSV file with faculty details. The file should include: Name, Email, Department, and Role.
          </div>
          <Button className="w-full" disabled>Import Faculty</Button>
        </div>
      )
    });
    
    setIsDialogOpen(true);
  };

  const handleGenerateReports = () => {
    toast({
      title: "Report Generation",
      description: "Opening report generation panel",
    });
    
    setDialogContent({
      title: "Generate Reports",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
              <div className="font-medium">Faculty Workload Report</div>
              <div className="text-sm text-muted-foreground">Shows workload distribution across faculty members</div>
            </div>
            <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
              <div className="font-medium">Resource Utilization Report</div>
              <div className="text-sm text-muted-foreground">Shows usage patterns of classrooms and labs</div>
            </div>
            <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
              <div className="font-medium">Department Activity Report</div>
              <div className="text-sm text-muted-foreground">Summarizes activities by department</div>
            </div>
          </div>
          <Button className="w-full">Generate Selected Report</Button>
        </div>
      )
    });
    
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSystemSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleManageUsers}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Welcome, <strong>{user?.name}</strong>. You are logged in with <strong>{user?.role.toUpperCase()}</strong> privileges.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">User Management</CardTitle>
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
              <Button 
                size="sm" 
                className="w-full mt-2" 
                onClick={handleManageUsers}
              >
                <User className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Connection</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Auth0 Integration</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Calendar Integration</span>
                <span className="font-medium text-green-600">Synced</span>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={handleSystemSettings}
              >
                <Database className="h-4 w-4 mr-2" />
                System Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleEditSchedule}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Faculty Schedules
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleAdjustWorkload}
              >
                <Clock className="h-4 w-4 mr-2" />
                Adjust Workload Limits
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleSyncCalendar}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Sync Google Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleBulkImport}
              >
                <Users className="h-4 w-4 mr-2" />
                Bulk Faculty Import
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleGenerateReports}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="faculty">
        <TabsList className="mb-4">
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="resources">Resource Management</TabsTrigger>
          <TabsTrigger value="schedules">Schedule Management</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Admin tools for managing faculty profiles, workload adjustments, and permissions.</p>
              <Button className="mt-4" onClick={handleManageUsers}>Manage Faculty</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tools for adding, editing, and allocating resources like classrooms, labs, and equipment.</p>
              <Button className="mt-4">Manage Resources</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tools for creating and managing timetables, class schedules, and meeting allocations.</p>
              <Button className="mt-4" onClick={handleEditSchedule}>Manage Schedules</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Generate custom reports and view analytics on faculty workload, resource utilization, and more.</p>
              <Button className="mt-4" onClick={handleGenerateReports}>View Reports</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          {dialogContent.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};
