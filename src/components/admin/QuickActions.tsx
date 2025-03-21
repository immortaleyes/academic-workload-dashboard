
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { EditFacultySchedules } from "./actions/EditFacultySchedules";
import { AdjustWorkloadLimits } from "./actions/AdjustWorkloadLimits";
import { SyncGoogleCalendar } from "./actions/SyncGoogleCalendar";
import { BulkFacultyImport } from "./actions/BulkFacultyImport";
import { GenerateReports } from "./actions/GenerateReports";

export const QuickActions: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (dialogName: string) => {
    setActiveDialog(dialogName);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-muted-foreground" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* All action components with dialog control */}
          <EditFacultySchedules 
            openDialog={activeDialog === 'edit-schedules'} 
            onDialogClose={closeDialog} 
          />
          
          <AdjustWorkloadLimits 
            openDialog={activeDialog === 'adjust-workload'} 
            onDialogClose={closeDialog} 
          />
          
          <SyncGoogleCalendar 
            openDialog={activeDialog === 'sync-calendar'} 
            onDialogClose={closeDialog} 
          />
          
          <BulkFacultyImport 
            openDialog={activeDialog === 'bulk-import'} 
            onDialogClose={closeDialog} 
          />
          
          <GenerateReports 
            openDialog={activeDialog === 'generate-reports'} 
            onDialogClose={closeDialog} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
