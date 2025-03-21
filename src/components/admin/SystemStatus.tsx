
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Database, Server, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface SystemService {
  name: string;
  status: "connected" | "error" | "warning";
  lastChecked: Date;
  icon: React.ElementType;
}

export const SystemStatus: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [services, setServices] = useState<SystemService[]>([
    {
      name: "Database Connection",
      status: "connected",
      lastChecked: new Date(),
      icon: Database
    },
    {
      name: "Auth Integration",
      status: "connected",
      lastChecked: new Date(),
      icon: Shield
    },
    {
      name: "API Services",
      status: "connected",
      lastChecked: new Date(),
      icon: Server
    }
  ]);

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    
    // Simulate checking services
    setTimeout(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastChecked: new Date()
      })));
      
      setIsRefreshing(false);
      toast({
        title: "System Status Refreshed",
        description: "All services are operational."
      });
    }, 1500);
  };

  const handleRunDiagnostics = () => {
    setIsDialogOpen(true);
    
    // Simulate running diagnostics
    setTimeout(() => {
      toast({
        title: "Diagnostics Complete",
        description: "All system checks passed successfully."
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === "connected") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === "warning") {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5 text-muted-foreground" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <service.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className={`text-xs font-medium ${
                  service.status === "connected" ? "text-green-600" : 
                  service.status === "warning" ? "text-yellow-600" : 
                  "text-red-600"
                }`}>
                  {service.status === "connected" ? "Connected" : 
                   service.status === "warning" ? "Warning" : "Error"}
                </span>
              </div>
            </div>
          ))}

          <div className="text-xs text-muted-foreground mt-2">
            Last checked: {services[0].lastChecked.toLocaleTimeString()}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              className="w-1/2"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Status"}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-1/2"
              onClick={handleRunDiagnostics}
            >
              Run Diagnostics
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>System Diagnostics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Diagnostic Results</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Database Connectivity: OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Authentication Service: OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">API Endpoints: OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Resource Availability: OK</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
