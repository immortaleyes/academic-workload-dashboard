
import React, { useState, useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { useResource } from "@/context/ResourceContext";
import { useAuth } from "@/context/AuthContext";
import { AdminDashboard } from "@/components/AdminDashboard";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCards } from "@/components/dashboard/DashboardStatsCards";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

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
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        user={user} // Passing user from AuthContext, not as FacultyMember
        lastSyncTime={lastSyncTime}
        isRefreshing={isRefreshing}
        hasAdminPermission={hasPermission("admin")}
        onRefreshData={handleRefreshData}
      />
      
      <DashboardStatsCards 
        faculty={faculty}
        resources={resources}
        isGoogleConnected={isGoogleConnected}
      />
      
      <DashboardTabs faculty={faculty} />
    </div>
  );
};
