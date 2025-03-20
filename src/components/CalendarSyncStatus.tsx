
import React, { useState, useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Send, 
  RefreshCw,
  Trash2,
  Bell
} from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export const CalendarSyncStatus: React.FC = () => {
  const { faculty } = useFaculty();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [calendarConflicts, setCalendarConflicts] = useState<any[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkGoogleAuth = async () => {
      await googleCalendarService.initialize();
      setIsGoogleConnected(googleCalendarService.isAuthenticated());
      if (googleCalendarService.isAuthenticated()) {
        fetchCalendarEvents();
      }
    };
    
    checkGoogleAuth();
    
    // Detect calendar conflicts
    const detectConflicts = async () => {
      const allSchedules = faculty.flatMap(f => f.schedule);
      const conflicts = await googleCalendarService.detectScheduleConflicts(allSchedules);
      setCalendarConflicts(conflicts);
    };
    
    detectConflicts();
  }, [faculty]);

  const fetchCalendarEvents = async () => {
    setIsRefreshing(true);
    const events = await googleCalendarService.getEvents();
    setCalendarEvents(events);
    setIsRefreshing(false);
  };

  const handleGoogleSignIn = async () => {
    const success = await googleCalendarService.signIn();
    setIsGoogleConnected(success);
    
    if (success) {
      toast({
        title: "Success",
        description: "Connected to Google Calendar successfully!",
        duration: 3000,
      });
      fetchCalendarEvents();
    }
  };

  const handleSyncAllToCalendar = async () => {
    if (!isGoogleConnected) {
      await handleGoogleSignIn();
      if (!googleCalendarService.isAuthenticated()) return;
    }
    
    setSyncInProgress(true);
    setSyncProgress(0);
    let successCount = 0;
    const totalEvents = faculty.reduce((sum, f) => sum + f.schedule.length, 0);
    
    try {
      let processedCount = 0;
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
          
          processedCount++;
          setSyncProgress(Math.round((processedCount / totalEvents) * 100));
        }
      }
      
      setLastSyncTime(new Date());
      fetchCalendarEvents();
      
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
      setSyncProgress(100);
      
      // Reset progress bar after showing 100%
      setTimeout(() => {
        setSyncProgress(0);
      }, 1000);
    }
  };

  const handleRefreshEvents = async () => {
    setIsRefreshing(true);
    await fetchCalendarEvents();
    
    toast({
      title: "Calendar Refreshed",
      description: "Calendar events have been refreshed",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Synchronize faculty schedules with Google Calendar and manage events
          </CardDescription>
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
                  <Calendar className="h-4 w-4 mr-2" />
                  Connect to Google Calendar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleRefreshEvents}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    onClick={handleSyncAllToCalendar}
                    disabled={syncInProgress}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {syncInProgress ? "Syncing..." : "Sync All Schedules"}
                  </Button>
                </div>
              )}
            </div>
            
            {syncInProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Syncing faculty schedules...</span>
                  <span>{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}
            
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
            
            {isGoogleConnected && (
              <div className="py-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Upcoming Calendar Events</div>
                  <Badge variant="outline" className="text-xs">
                    {calendarEvents.length} events
                  </Badge>
                </div>
                
                {calendarEvents.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {calendarEvents.slice(0, 6).map((event, index) => (
                      <div key={index} className="bg-gray-50 border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{event.title || 'Untitled Event'}</div>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            {event.reminders?.length || 0} reminders
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.startTime && format(new Date(event.startTime), "EEE, MMM d • h:mm a")}
                        </div>
                      </div>
                    ))}
                    
                    {calendarEvents.length > 6 && (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        +{calendarEvents.length - 6} more events
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No upcoming events in your calendar
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
