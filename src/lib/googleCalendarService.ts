import { toast } from "@/components/ui/use-toast";
import { ScheduleEntry, ResourceSchedule } from "@/types/faculty";

// Development API key and client ID (replace with actual keys in production)
const API_KEY = "DUMMY_API_KEY_FOR_DEVELOPMENT"; 
const CLIENT_ID = "DUMMY_CLIENT_ID_FOR_DEVELOPMENT";
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
  
  // For development: bypass actual Google API calls
  private devMode = true;
  private mockEvents: any[] = [];
  
  private constructor() {}
  
  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }
  
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    // For development, always return success without actually loading scripts
    if (this.devMode) {
      this.isInitialized = true;
      console.log("🔄 [DEV MODE] Google Calendar service initialized");
      return true;
    }
    
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
    
    // For development, always return success
    if (this.devMode) {
      this.isSignedIn = true;
      console.log("🔄 [DEV MODE] Signed in to Google Calendar");
      toast({
        title: "Development Mode",
        description: "Dummy sign-in successful. In production, this would connect to your Google account.",
        duration: 5000,
      });
      return true;
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
    // For development, just reset the flag
    if (this.devMode) {
      this.isSignedIn = false;
      console.log("🔄 [DEV MODE] Signed out of Google Calendar");
      toast({
        title: "Development Mode",
        description: "Signed out of dummy Google Calendar connection",
        duration: 3000,
      });
      return;
    }
    
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
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isSignedIn && !this.devMode) {
      await this.signIn();
    }
    
    // For development, store event in memory
    if (this.devMode) {
      const eventId = `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.mockEvents.push({
        id: eventId,
        ...event,
        reminders: []
      });
      console.log("🔄 [DEV MODE] Added event:", event.title);
      
      toast({
        title: "Event Added (Development)",
        description: `Added "${event.title}" to mock calendar`,
        duration: 3000,
      });
      
      return eventId;
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
  
  public async updateEvent(eventId: string, updatedEvent: ScheduleEntry): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isSignedIn && !this.devMode) {
      await this.signIn();
    }
    
    // For development, update mock event
    if (this.devMode) {
      const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        console.error("🔄 [DEV MODE] Event not found for update:", eventId);
        return false;
      }
      
      this.mockEvents[eventIndex] = {
        ...this.mockEvents[eventIndex],
        ...updatedEvent
      };
      
      console.log("🔄 [DEV MODE] Updated event:", updatedEvent.title);
      
      toast({
        title: "Event Updated (Development)",
        description: `Updated "${updatedEvent.title}" in mock calendar`,
        duration: 3000,
      });
      
      return true;
    }
    
    try {
      // Get the existing event to preserve fields we're not updating
      const event = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });
      
      // Update the event with new details
      const updatedCalendarEvent = {
        ...event.result,
        summary: updatedEvent.title,
        start: {
          dateTime: updatedEvent.startTime.toISOString(),
        },
        end: {
          dateTime: updatedEvent.endTime.toISOString(),
        },
        description: `Event Type: ${updatedEvent.type}`,
      };
      
      await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: updatedCalendarEvent,
      });
      
      toast({
        title: "Event Updated",
        description: `Successfully updated "${updatedEvent.title}" in Google Calendar`,
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating event in Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to update event in Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  }
  
  public async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isSignedIn && !this.devMode) {
      await this.signIn();
    }
    
    // For development, delete mock event
    if (this.devMode) {
      const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        console.error("🔄 [DEV MODE] Event not found for deletion:", eventId);
        return false;
      }
      
      const deletedEvent = this.mockEvents[eventIndex];
      this.mockEvents.splice(eventIndex, 1);
      
      console.log("🔄 [DEV MODE] Deleted event:", deletedEvent.title);
      
      toast({
        title: "Event Deleted (Development)",
        description: `Deleted "${deletedEvent.title}" from mock calendar`,
        duration: 3000,
      });
      
      return true;
    }
    
    try {
      // Fix: Use a different name for the method to avoid the 'delete' reserved word
      await gapi.client.calendar.events['delete']({
        calendarId: 'primary',
        eventId: eventId,
      });
      
      toast({
        title: "Event Deleted",
        description: "Successfully deleted event from Google Calendar",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting event from Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to delete event from Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  }
  
  public async setupReminder(eventId: string, minutesBefore: number): Promise<boolean> {
    if (!this.isInitialized || (!this.isSignedIn && !this.devMode)) {
      await this.signIn();
    }
    
    // For development, add reminder to mock event
    if (this.devMode) {
      const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        console.error("🔄 [DEV MODE] Event not found for adding reminder:", eventId);
        return false;
      }
      
      if (!this.mockEvents[eventIndex].reminders) {
        this.mockEvents[eventIndex].reminders = [];
      }
      
      this.mockEvents[eventIndex].reminders.push({
        method: 'popup',
        minutes: minutesBefore
      });
      
      console.log(`🔄 [DEV MODE] Added ${minutesBefore}min reminder to event:`, this.mockEvents[eventIndex].title);
      return true;
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
  
  // Get all events from calendar (development mode returns mock events)
  public async getEvents(): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isSignedIn && !this.devMode) {
      await this.signIn();
    }
    
    // For development, return mock events
    if (this.devMode) {
      console.log("🔄 [DEV MODE] Returning mock events:", this.mockEvents.length);
      return this.mockEvents;
    }
    
    try {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      
      // Fix: Use bracket notation to access the 'list' method
      const response = await gapi.client.calendar.events['list']({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: oneMonthLater.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      return response.result.items || [];
    } catch (error) {
      console.error("Error fetching events from Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events from Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
      return [];
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
