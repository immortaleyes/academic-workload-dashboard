
import { toast } from "@/components/ui/use-toast";
import { ScheduleEntry, ResourceSchedule } from "@/types/faculty";

// This API key is a placeholder - in a production app you'd use environment variables
// or better yet, handle API calls from a backend service
const API_KEY = "YOUR_GOOGLE_API_KEY"; 
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";

/**
 * Google Calendar Service
 * Handles authentication, calendar operations, and conflict detection
 */
export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private isInitialized = false;
  private isSignedIn = false;
  private tokenClient: any = null;
  
  private constructor() {}
  
  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }
  
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      // Load the Google API client library
      await this.loadGapiScript();
      await this.loadGsiScript();
      
      await new Promise<void>((resolve) => {
        gapi.load('client', async () => {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
          });
          resolve();
        });
      });
      
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            throw response;
          }
          this.isSignedIn = true;
          toast({
            title: "Success",
            description: "Successfully connected to Google Calendar!",
            duration: 3000,
          });
        },
      });
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing Google Calendar service:", error);
      toast({
        title: "Error",
        description: "Failed to initialize Google Calendar integration",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  }
  
  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('gapi-script')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.id = 'gapi-script';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }
  
  private loadGsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('gsi-script')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'gsi-script';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }
  
  public async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      this.tokenClient.requestAccessToken();
      return true;
    } catch (error) {
      console.error("Error signing in to Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to sign in to Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  }
  
  public async signOut(): Promise<void> {
    if (!this.isInitialized || !this.isSignedIn) return;
    
    try {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
          gapi.client.setToken(null);
          this.isSignedIn = false;
          toast({
            title: "Signed Out",
            description: "Successfully signed out of Google Calendar",
            duration: 3000,
          });
        });
      }
    } catch (error) {
      console.error("Error signing out of Google Calendar:", error);
    }
  }
  
  public isAuthenticated(): boolean {
    return this.isSignedIn;
  }
  
  public async addEvent(event: ScheduleEntry): Promise<string | null> {
    if (!this.isInitialized || !this.isSignedIn) {
      await this.signIn();
    }
    
    try {
      const calendarEvent = {
        summary: event.title,
        start: {
          dateTime: event.startTime.toISOString(),
        },
        end: {
          dateTime: event.endTime.toISOString(),
        },
        description: `Event Type: ${event.type}`,
      };
      
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent,
      });
      
      toast({
        title: "Event Added",
        description: `Successfully added "${event.title}" to Google Calendar`,
        duration: 3000,
      });
      
      return response.result.id;
    } catch (error) {
      console.error("Error adding event to Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to add event to Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }
  }
  
  public async setupReminder(eventId: string, minutesBefore: number): Promise<boolean> {
    if (!this.isInitialized || !this.isSignedIn) {
      await this.signIn();
    }
    
    try {
      const event = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });
      
      const updatedEvent = { 
        ...event.result,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: minutesBefore },
            { method: 'popup', minutes: minutesBefore },
          ],
        },
      };
      
      await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: updatedEvent,
      });
      
      return true;
    } catch (error) {
      console.error("Error setting up reminder:", error);
      return false;
    }
  }
  
  // Check for scheduling conflicts
  public async detectScheduleConflicts(
    events: (ScheduleEntry | ResourceSchedule)[]
  ): Promise<{ event1: any; event2: any }[]> {
    const conflicts: { event1: any; event2: any }[] = [];
    
    // Sort events by start time for more efficient conflict detection
    const sortedEvents = [...events].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    
    // Check for overlapping time slots
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        const event1 = sortedEvents[i];
        const event2 = sortedEvents[j];
        
        // Check for resource ID conflicts (for ResourceSchedule type)
        if (
          'resourceId' in event1 && 
          'resourceId' in event2 && 
          event1.resourceId === event2.resourceId
        ) {
          // Check for time overlap
          if (
            (event1.startTime <= event2.endTime) && 
            (event1.endTime >= event2.startTime)
          ) {
            conflicts.push({ event1, event2 });
          }
        }
        
        // Check for faculty ID conflicts
        if (
          'facultyId' in event1 && 
          'facultyId' in event2 && 
          event1.facultyId === event2.facultyId
        ) {
          // Check for time overlap
          if (
            (event1.startTime <= event2.endTime) && 
            (event1.endTime >= event2.startTime)
          ) {
            conflicts.push({ event1, event2 });
          }
        }
      }
    }
    
    return conflicts;
  }
}

// Export a singleton instance
export const googleCalendarService = GoogleCalendarService.getInstance();
