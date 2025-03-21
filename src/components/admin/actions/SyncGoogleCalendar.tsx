
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CheckCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { googleCalendarService } from "@/lib/googleCalendarService";

export const SyncGoogleCalendar: React.FC<{
  openDialog?: boolean;
  onDialogClose?: () => void;
}> = ({ openDialog = false, onDialogClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await googleCalendarService.initialize();
        const authStatus = googleCalendarService.isAuthenticated();
        setIsConnected(authStatus);
      } catch (error) {
        console.error("Failed to check Google Calendar connection:", error);
      }
    };
    
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      await googleCalendarService.initialize();
      const success = await googleCalendarService.signIn();
      
      if (success) {
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Successfully connected to Google Calendar",
        });
      } else {
        throw new Error("Failed to authenticate with Google");
      }
    } catch (error) {
      console.error("Google Calendar connection failed:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsConnecting(true);
    
    try {
      const events = await googleCalendarService.getEvents();
      setEventCount(events.length);
      setLastSync(new Date());
      
      toast({
        title: "Calendar Synced",
        description: `Successfully synced ${events.length} events from Google Calendar`,
      });
    } catch (error) {
      console.error("Google Calendar sync failed:", error);
      toast({
        title: "Sync Failed",
        description: "Could not sync with Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
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
        <Calendar className="h-4 w-4 mr-2" />
        Sync Google Calendar
      </Button>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Calendar Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Connection Status:</span>
                {isConnected ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 text-sm">
                    <XCircle className="h-4 w-4 mr-1" /> Not Connected
                  </span>
                )}
              </div>
              {lastSync && (
                <span className="text-xs text-muted-foreground">
                  Last sync: {lastSync.toLocaleString()}
                </span>
              )}
            </div>
            
            {isConnected && (
              <div className="border rounded-lg p-3 bg-gray-50">
                <h3 className="font-medium text-sm mb-1">Sync Information</h3>
                <p className="text-xs text-muted-foreground">
                  {eventCount > 0 
                    ? `${eventCount} events synced successfully` 
                    : "No events have been synced yet"}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {isConnected ? (
                <Button 
                  className="w-full" 
                  disabled={isConnecting}
                  onClick={handleSync}
                >
                  {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isConnecting ? "Syncing..." : "Sync Calendar Now"}
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  disabled={isConnecting}
                  onClick={handleConnect}
                >
                  {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isConnecting ? "Connecting..." : "Connect to Google Calendar"}
                </Button>
              )}
              
              {isConnected && (
                <Button variant="outline" className="w-full" onClick={closeDialog}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
