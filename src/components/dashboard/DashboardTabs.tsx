
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkloadSummary } from "@/components/WorkloadSummary";
import { FreeSlotsFinder } from "@/components/FreeSlotsFinder";
import { ResourceUsageSummary } from "@/components/ResourceUsageSummary";
import { CalendarSyncStatus } from "@/components/CalendarSyncStatus";
import { ExternalSyncStatus } from "@/components/ExternalSyncStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Faculty } from "@/types/faculty";

interface DashboardTabsProps {
  faculty: Faculty[];
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ faculty }) => {
  return (
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
  );
};
