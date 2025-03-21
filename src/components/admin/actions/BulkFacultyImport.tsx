
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Check, Download, Upload, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const BulkFacultyImport: React.FC<{
  openDialog?: boolean;
  onDialogClose?: () => void;
}> = ({ openDialog = false, onDialogClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setIsDialogOpen(true);
    resetState();
  };

  const resetState = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setValidationErrors([]);
    setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file processing with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
            // Simulate validation errors for demo purposes
            setValidationErrors([
              "Row 3: Missing department information",
              "Row 7: Invalid email format"
            ]);
            
            toast({
              title: "Import Complete",
              description: "Faculty data has been processed with 2 validation issues.",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleDownloadTemplate = () => {
    // In a real implementation, this would generate and download a CSV template
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your downloads folder.",
    });
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
        <Users className="h-4 w-4 mr-2" />
        Bulk Faculty Import
      </Button>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Faculty Import</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with faculty details including Name, Email, Department, and Position.
            </p>
            
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange} 
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {file ? file.name : "Drag and drop a CSV file or click to browse"}
                </p>
                <Button variant="outline" size="sm" disabled={isUploading}>
                  {file ? "Change File" : "Select File"}
                </Button>
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
            
            {uploadComplete && validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">Validation Issues:</div>
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {uploadComplete && validationErrors.length === 0 && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Import completed successfully with no validation issues.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button 
                className="flex-1" 
                disabled={!file || isUploading}
                onClick={handleImport}
              >
                {uploadComplete ? "Re-Import" : "Import Faculty"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
