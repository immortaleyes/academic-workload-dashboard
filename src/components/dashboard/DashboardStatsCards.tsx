
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Faculty } from "@/types/faculty";
import { Resource } from "@/types/faculty"; // Using the same types file

interface DashboardStatsCardsProps {
  faculty: Faculty[];
  resources: Resource[];
  isGoogleConnected: boolean;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  faculty,
  resources,
  isGoogleConnected,
}) => {
  return (
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
  );
};
