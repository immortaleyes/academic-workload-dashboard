
import React, { useState, useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Calendar, CheckCircle, Send } from "lucide-react";
import { format } from "date-fns";

export const CalendarSyncStatus: React.FC = () => {
  const { faculty } = useFaculty();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [calendarConflicts, setCalendarConflicts] = useState<any[]>([]);

  useEffect(() => {
    const checkGoogleAuth = async () => {
      await googleCalendarService.initialize();
      setIsGoogleConnected(googleCalendarService.isAuthenticated());
    };
    
    checkGoogleAuth();
    
    // Simulate detecting calendar conflicts
    const allSchedules = faculty.flatMap(f => f.schedule);
    googleCalendarService.detectScheduleConflicts(allSchedules)
      .then(conflicts => {
        setCalendarConflicts(conflicts);
      });
  }, [faculty]);

  const handleGoogleSignIn = async () => {
    const success = await googleCalendarService.signIn();
    setIsGoogleConnected(success);
    
    if (success) {
      toast({
        title: "Success",
        description: "Connected to Google Calendar successfully!",
        duration: 3000,
      });
    }
  };

  const handleSyncAllToCalendar = async () => {
    if (!isGoogleConnected) {
      await handleGoogleSignIn();
      if (!googleCalendarService.isAuthenticated()) return;
    }
    
    setSyncInProgress(true);
    let successCount = 0;
    const totalEvents = faculty.reduce((sum, f) => sum + f.schedule.length, 0);
    
    try {
      for (const facultyMember of faculty) {
        for (const event of facultyMember.schedule) {
          const eventId = await googleCalendarService.addEvent({
            ...event,
            title: `${event.title} - ${facultyMember.name}`
          });
          
          if (eventId) {
            await googleCalendarService.setupReminder(eventId, 30);
            successCount++;
          }
        }
      }
      
      setLastSyncTime(new Date());
      
      toast({
        title: "Calendar Synchronized",
        description: `Successfully added ${successCount} of ${totalEvents} events to Google Calendar with reminders`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error syncing to Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to sync with Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setSyncInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Google Calendar Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium mb-1">Connection Status</div>
                <div className="flex items-center gap-2">
                  {isGoogleConnected ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Connected to Google Calendar</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-600">Not connected to Google Calendar</span>
                    </>
                  )}
                </div>
              </div>
              
              {!isGoogleConnected ? (
                <Button onClick={handleGoogleSignIn}>
                  Connect to Google Calendar
                </Button>
              ) : (
                <Button 
                  onClick={handleSyncAllToCalendar}
                  disabled={syncInProgress}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {syncInProgress ? "Syncing..." : "Sync All Schedules"}
                </Button>
              )}
            </div>
            
            {lastSyncTime && (
              <div className="py-2 border-t">
                <div className="text-sm font-medium mb-1">Last Sync</div>
                <span className="text-sm text-muted-foreground">
                  {format(lastSyncTime, "MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            )}
            
            <div className="py-2 border-t">
              <div className="text-sm font-medium mb-2">Scheduling Conflicts</div>
              {calendarConflicts.length > 0 ? (
                <div className="space-y-2">
                  {calendarConflicts.slice(0, 3).map((conflict, index) => (
                    <div key={index} className="bg-red-50 border border-red-100 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Scheduling Conflict</span>
                      </div>
                      <p className="text-sm text-red-600">
                        "{conflict.event1.title}" and "{conflict.event2.title}" overlap in time.
                      </p>
                    </div>
                  ))}
                  
                  {calendarConflicts.length > 3 && (
                    <div className="text-sm text-center text-muted-foreground">
                      +{calendarConflicts.length - 3} more conflicts detected
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-md p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">No scheduling conflicts detected</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
