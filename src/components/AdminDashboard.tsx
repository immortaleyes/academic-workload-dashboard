
import React from "react";
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

export const AdminDashboard: React.FC = () => {
  const { faculty } = useFaculty();
  const { resources } = useResource();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button variant="outline" size="sm">
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
              <Button size="sm" className="w-full mt-2">
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
              <Button size="sm" className="w-full mt-2">
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
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Faculty Schedules
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Adjust Workload Limits
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Sync Google Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Bulk Faculty Import
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
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
              <Button className="mt-4">Manage Faculty</Button>
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
              <Button className="mt-4">Manage Schedules</Button>
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
              <Button className="mt-4">View Reports</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
