
// Type declarations for Google API Client
declare namespace gapi {
  namespace client {
    function init(config: {
      apiKey: string;
      discoveryDocs: string[];
    }): Promise<void>;

    function getToken(): {
      access_token: string;
    } | null;

    function setToken(token: {} | null): void;

    namespace calendar {
      namespace events {
        function insert(params: {
          calendarId: string;
          resource: any;
        }): Promise<{
          result: {
            id: string;
            [key: string]: any;
          };
        }>;

        function get(params: {
          calendarId: string;
          eventId: string;
        }): Promise<{
          result: any;
        }>;

        function update(params: {
          calendarId: string;
          eventId: string;
          resource: any;
        }): Promise<{
          result: any;
        }>;
        
        // Add methods for 'delete' and 'list' using string index signature
        // This allows us to use bracket notation like gapi.client.calendar.events['delete']
        [key: string]: any;
      }
    }
  }

  function load(apiName: string, callback: () => void): void;
}

// Type declarations for Google Identity Services
declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }

      interface TokenResponse {
        error?: string;
        access_token?: string;
        [key: string]: any;
      }

      function initTokenClient(config: TokenClientConfig): {
        requestAccessToken: () => void;
      };

      function revoke(token: string, callback: () => void): void;
    }
  }
}
