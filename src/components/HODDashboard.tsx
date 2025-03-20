import React, { useState, useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { useResource } from "@/context/ResourceContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WorkloadSummary } from "@/components/WorkloadSummary";
import { FreeSlotsFinder } from "@/components/FreeSlotsFinder";
import { ResourceUsageSummary } from "@/components/ResourceUsageSummary";
import { CalendarSyncStatus } from "@/components/CalendarSyncStatus";
import { ExternalSyncStatus } from "@/components/ExternalSyncStatus";
import { AdminDashboard } from "@/components/AdminDashboard";
import { HelpCircle, RefreshCw, Send, ShieldAlert } from "lucide-react";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { toast } from "@/components/ui/use-toast";

export const HODDashboard: React.FC = () => {
  const { faculty, loading: facultyLoading } = useFaculty();
  const { resources, loading: resourcesLoading } = useResource();
  const { user, hasPermission } = useAuth();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  if (hasPermission("admin")) {
    return <AdminDashboard />;
  }

  useEffect(() => {
    const checkGoogleAuth = async () => {
      await googleCalendarService.initialize();
      setIsGoogleConnected(googleCalendarService.isAuthenticated());
    };
    
    checkGoogleAuth();
    setLastSyncTime(new Date());
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date());
      
      toast({
        title: "Dashboard Updated",
        description: "All faculty and resource data has been refreshed",
        duration: 3000,
      });
    }, 1500);
  };

  const handleSendNotifications = () => {
    toast({
      title: "Notifications Sent",
      description: "Email notifications have been sent to all faculty members",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">HOD Dashboard</h2>
        <div className="flex items-center gap-2">
          {lastSyncTime && (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastSyncTime.toLocaleTimeString()}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendNotifications}
            disabled={!hasPermission("admin")}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>
      
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Welcome, <strong>{user?.name}</strong>. You are logged in with <strong>{user?.role.toUpperCase()}</strong> privileges.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Faculty Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Faculty</span>
                <span className="font-medium">{faculty.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Faculty Overbooked</span>
                <span className="font-medium text-red-600">
                  {faculty.filter(f => 
                    (f.workload.teachingHours + f.workload.labHours + f.workload.meetingHours) > 25
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Faculty Underutilized</span>
                <span className="font-medium text-amber-600">
                  {faculty.filter(f => 
                    (f.workload.teachingHours + f.workload.labHours + f.workload.meetingHours) < 15
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">External Sync Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resource Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Resources</span>
                <span className="font-medium">{resources.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resources Available</span>
                <span className="font-medium text-green-600">
                  {resources.filter(r => r.currentStatus === "available").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resources Occupied</span>
                <span className="font-medium text-amber-600">
                  {resources.filter(r => r.currentStatus === "occupied").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resources in Maintenance</span>
                <span className="font-medium text-red-600">
                  {resources.filter(r => r.currentStatus === "maintenance").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Calendar Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Google Calendar</span>
                {isGoogleConnected ? (
                  <span className="font-medium text-green-600">Connected</span>
                ) : (
                  <span className="font-medium text-red-600">Disconnected</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Conflicts Detected</span>
                <span className="font-medium text-red-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Upcoming Reminders</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Notification Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="faculty">
        <TabsList className="mb-4">
          <TabsTrigger value="faculty">Faculty Overview</TabsTrigger>
          <TabsTrigger value="free-slots">Free Slots</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Sync</TabsTrigger>
          <TabsTrigger value="external">External Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Workload Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkloadSummary faculty={faculty} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="free-slots">
          <FreeSlotsFinder />
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourceUsageSummary />
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarSyncStatus />
        </TabsContent>
        
        <TabsContent value="external">
          <ExternalSyncStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};
