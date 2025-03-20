
import React, { useEffect, useState } from "react";
import { 
  Bell,
  Calendar,
  AlertTriangle,
  X,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useFaculty } from "@/context/FacultyContext";
import { useResource } from "@/context/ResourceContext";
import { Button } from "@/components/ui/button";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const ScheduleNotifications: React.FC = () => {
  const { faculty } = useFaculty();
  const { resources } = useResource();
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkGoogleAuth = async () => {
      await googleCalendarService.initialize();
      const isAuthenticated = googleCalendarService.isAuthenticated();
      setIsGoogleConnected(isAuthenticated);
      
      if (isAuthenticated) {
        fetchCalendarEvents();
      }
    };
    
    checkGoogleAuth();
  }, []);

  useEffect(() => {
    // Check for scheduling conflicts when faculty or resources change
    const checkConflicts = async () => {
      // Collect all schedule entries from faculty and resources
      const allSchedules = [
        ...faculty.flatMap(f => f.schedule),
        ...resources.flatMap(r => r.schedule)
      ];
      
      const conflicts = await googleCalendarService.detectScheduleConflicts(allSchedules);
      setConflicts(conflicts);
      setNotificationCount(prev => conflicts.length + (calendarEvents.length > 0 ? 1 : 0));
      
      // Show toast for new conflicts
      if (conflicts.length > 0) {
        toast({
          title: "Schedule Conflicts Detected",
          description: `There are ${conflicts.length} scheduling conflicts to resolve`,
          variant: "destructive",
          duration: 5000,
        });
      }
    };
    
    if (faculty.length > 0 && resources.length > 0) {
      checkConflicts();
    }
  }, [faculty, resources, calendarEvents.length]);

  const fetchCalendarEvents = async () => {
    setIsRefreshing(true);
    try {
      const events = await googleCalendarService.getEvents();
      setCalendarEvents(events);
      
      // Update notification count to include calendar events
      setNotificationCount(prev => conflicts.length + (events.length > 0 ? 1 : 0));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setIsRefreshing(false);
    }
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

  const handleGoogleSignOut = async () => {
    await googleCalendarService.signOut();
    setIsGoogleConnected(false);
    setCalendarEvents([]);
    setNotificationCount(conflicts.length);
  };

  const handleSendToCalendar = async (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (!facultyMember) return;
    
    try {
      // Add all schedule entries to Google Calendar
      for (const event of facultyMember.schedule) {
        const eventId = await googleCalendarService.addEvent({
          ...event,
          title: `${event.title} - ${facultyMember.name}`
        });
        
        if (eventId) {
          // Add a 30-minute reminder
          await googleCalendarService.setupReminder(eventId, 30);
        }
      }
      
      fetchCalendarEvents();
      
      toast({
        title: "Calendar Updated",
        description: `${facultyMember.name}'s schedule has been added to Google Calendar with reminders`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error sending to Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to update Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const dismissNotification = (index: number) => {
    setConflicts(prev => prev.filter((_, i) => i !== index));
    setNotificationCount(prev => prev - 1);
  };

  const refreshNotifications = async () => {
    setIsRefreshing(true);
    
    // Refresh calendar events
    if (isGoogleConnected) {
      await fetchCalendarEvents();
    }
    
    // Recheck conflicts
    const allSchedules = [
      ...faculty.flatMap(f => f.schedule),
      ...resources.flatMap(r => r.schedule)
    ];
    
    const newConflicts = await googleCalendarService.detectScheduleConflicts(allSchedules);
    setConflicts(newConflicts);
    setNotificationCount(newConflicts.length + (calendarEvents.length > 0 ? 1 : 0));
    
    setIsRefreshing(false);
    
    toast({
      title: "Notifications Refreshed",
      description: "All notifications have been updated",
      duration: 3000,
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </Button>
      
      {showNotifications && (
        <div className="absolute right-0 top-10 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden border">
          <div className="px-4 py-3 bg-primary text-primary-foreground font-medium flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
                onClick={refreshNotifications}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="divide-y max-h-96 overflow-auto">
            {/* Google Calendar Connection Status */}
            <div className="p-3 flex flex-col gap-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Google Calendar Integration
              </h4>
              {isGoogleConnected ? (
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Connected
                  </span>
                  <Button size="sm" variant="outline" onClick={handleGoogleSignOut} className="h-7 text-xs">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="default" onClick={handleGoogleSignIn} className="h-7 text-xs">
                  Connect to Google Calendar
                </Button>
              )}
            </div>
            
            {/* Google Calendar Events */}
            {isGoogleConnected && calendarEvents.length > 0 && (
              <div className="p-3 hover:bg-gray-50">
                <h4 className="text-sm font-medium flex items-center gap-2 text-primary mb-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Calendar Events
                </h4>
                <div className="space-y-2">
                  {calendarEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="text-xs bg-blue-50 border border-blue-100 rounded p-2">
                      <div className="font-medium">{event.title || 'Untitled Event'}</div>
                      {event.startTime && (
                        <div className="text-muted-foreground mt-0.5">
                          {format(new Date(event.startTime), "EEE, MMM d • h:mm a")}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {calendarEvents.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{calendarEvents.length - 3} more events
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Scheduling Conflicts */}
            {conflicts.length > 0 ? (
              conflicts.map((conflict, index) => (
                <div key={index} className="p-3 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Scheduling Conflict
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-gray-500"
                      onClick={() => dismissNotification(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    "{conflict.event1.title}" and "{conflict.event2.title}" overlap in time.
                  </p>
                </div>
              ))
            ) : (
              !isGoogleConnected && calendarEvents.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications to display
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
