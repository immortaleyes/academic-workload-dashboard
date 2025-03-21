
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const AdjustWorkloadLimits: React.FC<{
  openDialog?: boolean;
  onDialogClose?: () => void;
}> = ({ openDialog = false, onDialogClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workloadLimits, setWorkloadLimits] = useState({
    teaching: 20,
    lab: 15,
    meeting: 10,
    office: 5
  });

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkloadLimits(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSave = () => {
    toast({
      title: "Workload Limits Updated",
      description: "New workload limits have been applied successfully.",
    });
    setIsDialogOpen(false);
    if (onDialogClose) {
      onDialogClose();
    }
  };

  // Use external dialog control if provided
  const dialogOpen = openDialog !== undefined ? openDialog : isDialogOpen;
  const closeDialog = onDialogClose || (() => setIsDialogOpen(false));

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start" 
        onClick={handleOpen}
      >
        <Clock className="h-4 w-4 mr-2" />
        Adjust Workload Limits
      </Button>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Workload Limits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set maximum workload hours per week for different activities to ensure balanced faculty workloads.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teaching">Max Teaching Hours</Label>
                <Input 
                  id="teaching"
                  name="teaching"
                  type="number"
                  value={workloadLimits.teaching}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lab">Max Lab Hours</Label>
                <Input 
                  id="lab"
                  name="lab"
                  type="number"
                  value={workloadLimits.lab}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meeting">Max Meeting Hours</Label>
                <Input 
                  id="meeting"
                  name="meeting"
                  type="number"
                  value={workloadLimits.meeting}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="office">Office Hours</Label>
                <Input 
                  id="office"
                  name="office"
                  type="number"
                  value={workloadLimits.office}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
