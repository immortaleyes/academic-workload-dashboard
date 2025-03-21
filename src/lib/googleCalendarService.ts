
import { toast } from '@/components/ui/use-toast';

// Set up the API key and client ID
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your actual client ID
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';

class GoogleCalendarService {
  private tokenClient: any = null;
  private initialized = false;

  /**
   * Initialize the Google API client
   */
  async initialize() {
    // Avoid multiple initializations
    if (this.initialized) return true;

    try {
      // Load the gapi client
      await this.loadGapiClient();
      
      // Only in development, for testing
      if (process.env.NODE_ENV === 'development') {
        console.info('🔄 [DEV MODE] Google Calendar service initialized');
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar service:', error);
      return false;
    }
  }

  /**
   * Load the Google API client
   */
  private loadGapiClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulating successful loading in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(resolve, 100);
        return;
      }

      // In production, would load the actual library
      try {
        // @ts-ignore - gapi is loaded from CDN
        gapi.load('client', async () => {
          try {
            // @ts-ignore - gapi is loaded from CDN
            await gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sign in to Google
   */
  async signIn(): Promise<boolean> {
    if (!this.initialized) await this.initialize();

    // Mock successful sign-in for development
    if (process.env.NODE_ENV === 'development') {
      // Store a fake token in localStorage to simulate authenticated state
      localStorage.setItem('google_calendar_token', JSON.stringify({
        access_token: 'fake_token_' + Date.now(),
        expiry: Date.now() + 3600000 // 1 hour
      }));
      return true;
    }

    try {
      if (!this.tokenClient) {
        // @ts-ignore - google.accounts is loaded from CDN
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse: any) => {
            if (tokenResponse.error) {
              throw new Error(tokenResponse.error);
            }
            localStorage.setItem('google_calendar_token', JSON.stringify({
              access_token: tokenResponse.access_token,
              expiry: Date.now() + 3600000 // 1 hour
            }));
          },
        });
      }

      // Request access token
      this.tokenClient.requestAccessToken();
      return true;
    } catch (error) {
      console.error('Google sign in failed:', error);
      toast({
        title: "Google Sign In Failed",
        description: "Could not connect to Google Calendar",
        variant: "destructive",
      });
      return false;
    }
  }

  /**
   * Sign out from Google
   */
  async signOut(): Promise<void> {
    // Remove token from localStorage
    localStorage.removeItem('google_calendar_token');

    // For development mode, we're done
    if (process.env.NODE_ENV === 'development') return;

    // In production, revoke the token
    try {
      const token = this.getToken();
      if (token) {
        // @ts-ignore - google.accounts is loaded from CDN
        google.accounts.oauth2.revoke(token, () => {
          // @ts-ignore - gapi is loaded from CDN
          gapi.client.setToken(null);
        });
      }
    } catch (error) {
      console.error('Google sign out failed:', error);
    }
  }

  /**
   * Check if user is authenticated with Google
   */
  isAuthenticated(): boolean {
    const tokenData = localStorage.getItem('google_calendar_token');
    if (!tokenData) return false;

    try {
      const { expiry } = JSON.parse(tokenData);
      return expiry > Date.now();
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the authentication token
   */
  private getToken(): string | null {
    const tokenData = localStorage.getItem('google_calendar_token');
    if (!tokenData) return null;

    try {
      const { access_token } = JSON.parse(tokenData);
      return access_token;
    } catch (e) {
      return null;
    }
  }

  /**
   * Add an event to Google Calendar
   */
  async addEvent(event: any): Promise<string | null> {
    if (!this.isAuthenticated()) {
      const signedIn = await this.signIn();
      if (!signedIn) return null;
    }

    // Mock event creation for development
    if (process.env.NODE_ENV === 'development') {
      return 'fake_event_' + Date.now();
    }

    try {
      // @ts-ignore - gapi is loaded from CDN
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: event.title,
          location: event.location || '',
          description: event.description || '',
          start: {
            dateTime: event.startTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.endTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      });

      return response.result.id;
    } catch (error) {
      console.error('Failed to add event to Google Calendar:', error);
      toast({
        title: "Calendar Error",
        description: "Failed to add event to Google Calendar",
        variant: "destructive",
      });
      return null;
    }
  }

  /**
   * Set up a reminder for an event
   */
  async setupReminder(eventId: string, minutes: number): Promise<boolean> {
    if (!this.isAuthenticated() || !eventId) return false;

    // Mock reminder setup for development
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    try {
      // Get the event first
      // @ts-ignore - gapi is loaded from CDN
      const getResponse = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      const event = getResponse.result;
      
      // Add reminder
      event.reminders = {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes },
        ],
      };

      // Update the event
      // @ts-ignore - gapi is loaded from CDN
      await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      return true;
    } catch (error) {
      console.error('Failed to set up reminder:', error);
      return false;
    }
  }

  /**
   * Get events from Google Calendar
   */
  async getEvents(days = 7): Promise<any[]> {
    if (!this.isAuthenticated()) {
      const signedIn = await this.signIn();
      if (!signedIn) return [];
    }

    // Mock events for development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          id: 'fake_event_1',
          title: 'Faculty Meeting',
          startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        },
        {
          id: 'fake_event_2',
          title: 'Department Review',
          startTime: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
          endTime: new Date(Date.now() + 172800000 + 7200000).toISOString(),
        },
        {
          id: 'fake_event_3',
          title: 'Student Advising',
          startTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
          endTime: new Date(Date.now() + 259200000 + 5400000).toISOString(),
        }
      ];
    }

    try {
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + days * 86400000).toISOString();

      // @ts-ignore - gapi is loaded from CDN
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.result.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        location: event.location,
        startTime: event.start.dateTime || event.start.date,
        endTime: event.end.dateTime || event.end.date,
      }));
    } catch (error) {
      console.error('Failed to get events from Google Calendar:', error);
      return [];
    }
  }

  /**
   * Detect scheduling conflicts
   */
  async detectScheduleConflicts(scheduleEntries: any[]): Promise<any[]> {
    // For development, return mock conflicts
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          event1: { title: 'Department Meeting', startTime: '2023-06-15T10:00:00' },
          event2: { title: 'Faculty Workshop', startTime: '2023-06-15T09:30:00' }
        },
        {
          event1: { title: 'Research Seminar', startTime: '2023-06-16T14:00:00' },
          event2: { title: 'Committee Meeting', startTime: '2023-06-16T13:30:00' }
        }
      ];
    }

    // Implementation for production would compare schedules
    // This would check for overlaps between events
    const conflicts: any[] = [];
    
    // O(n²) time complexity - could be optimized further in production
    for (let i = 0; i < scheduleEntries.length; i++) {
      for (let j = i + 1; j < scheduleEntries.length; j++) {
        const event1 = scheduleEntries[i];
        const event2 = scheduleEntries[j];
        
        // Check if events overlap
        if (this.eventsOverlap(event1, event2)) {
          conflicts.push({ event1, event2 });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Check if two events overlap in time
   */
  private eventsOverlap(event1: any, event2: any): boolean {
    const event1Start = new Date(event1.startTime).getTime();
    const event1End = new Date(event1.endTime || 
      new Date(event1Start + 3600000).toISOString()).getTime(); // Default 1 hour if no end time
    
    const event2Start = new Date(event2.startTime).getTime();
    const event2End = new Date(event2.endTime || 
      new Date(event2Start + 3600000).toISOString()).getTime(); // Default 1 hour if no end time
    
    // Check for overlap
    return (event1Start < event2End && event1End > event2Start);
  }
}

export const googleCalendarService = new GoogleCalendarService();
