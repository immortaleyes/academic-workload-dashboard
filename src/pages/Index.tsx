
import React, { useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { FacultyGrid } from "@/components/FacultyGrid";
import { WorkloadSummary } from "@/components/WorkloadSummary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityFilter } from "@/types/faculty";
import { Calendar, CalendarDays, CalendarRange, Building, PieChart, BadgeCheck } from "lucide-react";
import { ResourceTracker } from "@/components/ResourceTracker";
import { FacultyWorkloadDashboard } from "@/components/FacultyWorkloadDashboard";
import { CalendarIntegration } from "@/components/CalendarIntegration";
import { HODDashboard } from "@/components/HODDashboard";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { faculty, loading, currentFilter, setCurrentFilter } = useFaculty();
  const { user, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"faculty" | "resources" | "dashboard" | "calendar" | "hod">("hod");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container px-6 py-8 mx-auto">
        <Tabs defaultValue="hod" onValueChange={(value) => setActiveTab(value as "faculty" | "resources" | "dashboard" | "calendar" | "hod")}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="hod">
                <BadgeCheck className="h-4 w-4 mr-2" />
                {hasPermission("admin") ? "Admin Dashboard" : "HOD Dashboard"}
              </TabsTrigger>
              <TabsTrigger value="dashboard">
                <PieChart className="h-4 w-4 mr-2" />
                Workload Dashboard
              </TabsTrigger>
              <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
              <TabsTrigger value="resources">Resource Tracker</TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar Integration
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Logged in as <span className="font-medium">{user?.name}</span> ({user?.role.toUpperCase()})
              </div>
              <Button variant="outline" size="sm" onClick={logout}>Log Out</Button>
            </div>
          </div>
          
          <TabsContent value="hod">
            <HODDashboard />
          </TabsContent>
          
          <TabsContent value="dashboard">
            <FacultyWorkloadDashboard />
          </TabsContent>
          
          <TabsContent value="faculty">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-4 lg:col-span-1">
                <WorkloadSummary faculty={faculty} />
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      Availability View
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={currentFilter} onValueChange={(value) => setCurrentFilter(value as AvailabilityFilter)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="day" className="flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-2" /> Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="flex items-center justify-center">
                          <CalendarDays className="h-4 w-4 mr-2" /> Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="flex items-center justify-center">
                          <CalendarRange className="h-4 w-4 mr-2" /> Month
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Filter faculty availability by day, week, or month to identify free slots.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-4 lg:col-span-3">
                <FacultyGrid faculty={faculty} isLoading={loading} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourceTracker />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarIntegration />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container px-6 mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Faculty Workload Dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} University Administration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <Dashboard />
  );
};

export default Index;
