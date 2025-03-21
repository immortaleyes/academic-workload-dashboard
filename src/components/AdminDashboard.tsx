
import React, { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { useResource } from "@/context/ResourceContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminPanel } from "./admin/AdminPanel";

export const AdminDashboard: React.FC = () => {
  const { faculty } = useFaculty();
  const { resources } = useResource();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{title: string; content: React.ReactNode}>({
    title: "",
    content: null
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Welcome, <strong>{user?.name}</strong>. You are logged in with <strong>{user?.role.toUpperCase()}</strong> privileges.
        </AlertDescription>
      </Alert>
      
      {/* Admin Panel Components */}
      <AdminPanel />
      
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
