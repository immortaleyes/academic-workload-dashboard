
import React, { useState, useEffect } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { googleCalendarService } from "@/lib/googleCalendarService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CircleAlert, Clock, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const CalendarIntegration: React.FC = () => {
  const { faculty } = useFaculty();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  
  useEffect(() => {
    const initializeGoogleCalendar = async () => {
      await googleCalendarService.initialize();
      setIsGoogleConnected(googleCalendarService.isAuthenticated());
    };
    
    initializeGoogleCalendar();
  }, []);
  
  useEffect(() => {
    if (faculty.length > 0) {
      // Get upcoming events from the faculty schedules
      const now = new Date();
      const allEvents = faculty.flatMap(f => 
        f.schedule.map(event => ({
          ...event,
          facultyName: f.name,
          facultyId: f.id
        }))
      );
      
      // Filter for events in the next 48 hours
      const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      const upcoming = allEvents.filter(event => 
        event.startTime > now && event.startTime <= fortyEightHoursLater
      ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      
      setUpcomingEvents(upcoming.slice(0, 5)); // Show top 5 upcoming events
    }
  }, [faculty]);
  
  const handleGoogleSignIn = async () => {
    const success = await googleCalendarService.signIn();
    setIsGoogleConnected(success);
  };
  
  const handleSendToCalendar = async (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (!facultyMember) return;
    
    try {
      // Add all schedule entries to Google Calendar
      for (const event of facultyMember.schedule) {
        const eventId = await googleCalendarService.addEvent(event);
        if (eventId) {
          // Add a 30-minute reminder
          await googleCalendarService.setupReminder(eventId, 30);
        }
      }
      
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
  
  const handleSendAllToCalendar = async () => {
    if (!isGoogleConnected) {
      await handleGoogleSignIn();
      if (!googleCalendarService.isAuthenticated()) return;
    }
    
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
      
      toast({
        title: "Calendar Updated",
        description: `Successfully added ${successCount} of ${totalEvents} events to Google Calendar with reminders`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error sending all to Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to update Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Set up reminders and sync faculty schedules to Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isGoogleConnected ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Connect to Google Calendar to set up automatic reminders for classes, labs and meetings
            </p>
            <Button onClick={handleGoogleSignIn} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Connect Google Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Google Calendar</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>
            
            <Button 
              onClick={handleSendAllToCalendar}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Sync All Schedules to Calendar
            </Button>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Upcoming Events
              </h4>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="text-xs bg-gray-50 p-2 rounded border flex flex-col"
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        {format(event.startTime, "EEE, MMM d • h:mm a")}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-muted-foreground">{event.facultyName}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2"
                          onClick={() => handleSendToCalendar(event.facultyId)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send to Calendar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  <CircleAlert className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  No upcoming events in the next 48 hours
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
