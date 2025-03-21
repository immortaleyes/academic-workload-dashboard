
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Calendar, Download, FileDown, Loader2, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const GenerateReports: React.FC<{
  openDialog?: boolean;
  onDialogClose?: () => void;
}> = ({ openDialog = false, onDialogClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportFormat, setReportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("current-month");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes: ReportType[] = [
    {
      id: "faculty-workload",
      name: "Faculty Workload Report",
      description: "Shows workload distribution across faculty members",
      icon: Users
    },
    {
      id: "resource-utilization",
      name: "Resource Utilization Report",
      description: "Shows usage patterns of classrooms and labs",
      icon: BarChart
    },
    {
      id: "department-activity",
      name: "Department Activity Report",
      description: "Summarizes activities by department",
      icon: Calendar
    }
  ];

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleReportSelect = (id: string) => {
    setSelectedReport(id);
  };

  const handleGenerate = () => {
    if (!selectedReport) {
      toast({
        title: "No Report Selected",
        description: "Please select a report type to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      const selectedReportName = reportTypes.find(r => r.id === selectedReport)?.name;
      
      toast({
        title: "Report Generated",
        description: `${selectedReportName} has been generated in ${reportFormat.toUpperCase()} format.`,
      });
      
      // Close dialog
      if (onDialogClose) {
        onDialogClose();
      } else {
        setIsDialogOpen(false);
      }
    }, 2000);
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
        <BarChart className="h-4 w-4 mr-2" />
        Generate Reports
      </Button>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select a report type to generate detailed analytics and insights.
            </p>
            
            <div className="space-y-2">
              <div className="font-medium text-sm mb-2">Report Type</div>
              <RadioGroup value={selectedReport || ""} onValueChange={handleReportSelect}>
                <div className="space-y-2">
                  {reportTypes.map((report) => (
                    <div 
                      key={report.id}
                      className={`border rounded p-3 cursor-pointer transition-colors ${
                        selectedReport === report.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem 
                        value={report.id} 
                        id={report.id} 
                        className="hidden" 
                      />
                      <Label 
                        htmlFor={report.id}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <report.icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-xs text-muted-foreground">{report.description}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="previous-month">Previous Month</SelectItem>
                    <SelectItem value="current-semester">Current Semester</SelectItem>
                    <SelectItem value="academic-year">Academic Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!selectedReport || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
