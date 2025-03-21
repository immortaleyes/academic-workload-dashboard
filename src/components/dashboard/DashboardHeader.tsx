
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Send, ShieldAlert } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/faculty"; // Using the existing types

interface DashboardHeaderProps {
  user: User | null;
  lastSyncTime: Date | null;
  isRefreshing: boolean;
  hasAdminPermission: boolean;
  onRefreshData: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  lastSyncTime,
  isRefreshing,
  hasAdminPermission,
  onRefreshData,
}) => {
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
            onClick={onRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendNotifications}
            disabled={!hasAdminPermission}
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
    </div>
  );
};
