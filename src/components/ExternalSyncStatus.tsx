
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Database, 
  File, 
  RefreshCw, 
  Settings
} from "lucide-react";

export const ExternalSyncStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState("google-sheets");
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState("");
  const [airtableUrl, setAirtableUrl] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState("30");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    setIsSyncing(true);
    
    // Simulate connection attempt
    setTimeout(() => {
      setIsSyncing(false);
      
      toast({
        title: "Connected Successfully",
        description: `Connected to ${activeTab === "google-sheets" ? "Google Sheets" : 
          activeTab === "airtable" ? "Airtable" : "External API"}`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    
    // Simulate syncing
    setTimeout(() => {
      setIsSyncing(false);
      
      toast({
        title: "Sync Complete",
        description: "All faculty workload data has been synchronized",
        duration: 3000,
      });
    }, 2000);
  };

  const renderConnectionForm = () => {
    switch (activeTab) {
      case "google-sheets":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sheets-url">Google Sheets URL</Label>
              <Input 
                id="sheets-url" 
                placeholder="https://docs.google.com/spreadsheets/d/..." 
                value={googleSheetsUrl}
                onChange={(e) => setGoogleSheetsUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL of your Google Sheet containing faculty data
              </p>
            </div>
          </div>
        );
      case "airtable":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="airtable-url">Airtable Base ID</Label>
              <Input 
                id="airtable-url" 
                placeholder="appXXXXXXXXXXXXXX" 
                value={airtableUrl}
                onChange={(e) => setAirtableUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Airtable Base ID to connect to your faculty database
              </p>
            </div>
          </div>
        );
      case "api":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input 
                id="api-endpoint" 
                placeholder="https://api.youruniversity.edu/faculty-data" 
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the API endpoint that provides faculty workload data
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            External Data Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google-sheets" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="google-sheets" className="flex items-center justify-center">
                <File className="h-4 w-4 mr-2" />
                Google Sheets
              </TabsTrigger>
              <TabsTrigger value="airtable" className="flex items-center justify-center">
                <Database className="h-4 w-4 mr-2" />
                Airtable
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                External API
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="google-sheets">
              {renderConnectionForm()}
            </TabsContent>
            
            <TabsContent value="airtable">
              {renderConnectionForm()}
            </TabsContent>
            
            <TabsContent value="api">
              {renderConnectionForm()}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <Button onClick={handleConnect} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSyncNow}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync">Auto Synchronization</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync data at regular intervals
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            {autoSync && (
              <div className="space-y-2">
                <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                <Input
                  id="sync-interval"
                  type="number"
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  min="5"
                  max="120"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">
                Changes made through external synchronization may override manual edits.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
