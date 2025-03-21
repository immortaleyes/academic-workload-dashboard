
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar,
  Plus,
  RefreshCw,
  Trash2,
  CalendarPlus,
  AlertTriangle
} from "lucide-react";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const CalendarIntegration: React.FC = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    const checkGoogleAuth = async () => {
      await googleCalendarService.initialize();
      const isAuthenticated = googleCalendarService.isAuthenticated();
      setIsGoogleConnected(isAuthenticated);
      
      if (isAuthenticated) {
        fetchEvents();
      }
    };
    
    checkGoogleAuth();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const calendarEvents = await googleCalendarService.getEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await googleCalendarService.signIn();
    setIsGoogleConnected(success);
    
    if (success) {
      toast({
        title: "Connected",
        description: "Successfully connected to Google Calendar",
      });
      fetchEvents();
    }
  };

  const handleGoogleSignOut = async () => {
    await googleCalendarService.signOut();
    setIsGoogleConnected(false);
    setEvents([]);
    toast({
      title: "Disconnected",
      description: "Disconnected from Google Calendar",
    });
  };

  const refreshEvents = async () => {
    await fetchEvents();
    toast({
      title: "Refreshed",
      description: "Calendar events have been refreshed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar Integration</h2>
        <div className="flex items-center gap-2">
          {isGoogleConnected ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshEvents}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGoogleSignOut}
              >
                Disconnect Google Calendar
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleGoogleSignIn}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Connect Google Calendar
            </Button>
          )}
        </div>
      </div>
      
      {!isGoogleConnected ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Connect to Google Calendar to sync your faculty schedules and manage events from this dashboard.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Upcoming Calendar Events</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddEvent(!showAddEvent)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading calendar events...</p>
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.startTime ? format(new Date(event.startTime), "EEE, MMM d • h:mm a") : 'No date'}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground mt-2">No upcoming events found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowAddEvent(true)}>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {showAddEvent && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Calendar Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Event creation form implementation coming soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
