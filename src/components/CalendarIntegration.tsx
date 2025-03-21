
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
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

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

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const success = await googleCalendarService.deleteEvent(eventId);
        if (success) {
          setEvents(events.filter(event => event.id !== eventId));
          toast({
            title: "Event Deleted",
            description: "The event has been removed from your calendar",
          });
        } else {
          throw new Error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete calendar event",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      if (!newEvent.title || !newEvent.startDate || !newEvent.startTime) {
        toast({
          title: "Missing Information",
          description: "Please fill in the required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Create start and end dates
      const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
      let endDateTime;
      
      if (newEvent.endDate && newEvent.endTime) {
        endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);
      } else {
        // Default to 1 hour later if not specified
        endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1);
      }
      
      // Create event object
      const eventToAdd = {
        title: newEvent.title,
        description: newEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };
      
      // Add event to calendar
      const eventId = await googleCalendarService.addEvent(eventToAdd);
      
      if (eventId) {
        toast({
          title: "Event Created",
          description: "New event has been added to your calendar",
        });
        
        // Reset form and refresh events
        setNewEvent({
          title: '',
          description: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: ''
        });
        setShowAddEvent(false);
        fetchEvents();
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create calendar event",
        variant: "destructive",
      });
    }
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
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
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="startDate" className="text-sm font-medium">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={newEvent.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="startTime" className="text-sm font-medium">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={newEvent.startTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="endDate" className="text-sm font-medium">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={newEvent.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="endTime" className="text-sm font-medium">
                          End Time
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={newEvent.endTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddEvent(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Event
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
