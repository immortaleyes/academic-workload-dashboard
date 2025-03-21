
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const EditFacultySchedules: React.FC<{
  openDialog?: boolean;
  onDialogClose?: () => void;
}> = ({ openDialog = false, onDialogClose }) => {
  const navigate = useNavigate();

  const handleNavigateToSchedules = () => {
    if (onDialogClose) {
      onDialogClose();
    }
    navigate('/faculty');
    toast({
      title: "Faculty Management",
      description: "Navigated to faculty schedule editor",
    });
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start" 
        onClick={handleNavigateToSchedules}
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit Faculty Schedules
      </Button>

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={onDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Faculty Schedule Management</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm">
                Manage faculty schedules, workload assignments, and class allocations.
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium">Edit Class Schedules</div>
                  <div className="text-xs text-muted-foreground">Manage faculty class assignments</div>
                </div>
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium">Lab Sessions</div>
                  <div className="text-xs text-muted-foreground">Allocate laboratory sessions</div>
                </div>
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium">Office Hours</div>
                  <div className="text-xs text-muted-foreground">Set faculty availability hours</div>
                </div>
              </div>
              <Button onClick={handleNavigateToSchedules} className="w-full">
                Go to Schedule Manager
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
