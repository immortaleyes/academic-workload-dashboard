
import React, { useState } from "react";
import { useResource } from "@/context/ResourceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceFilter } from "@/types/faculty";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, BookOpen, Flask, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ResourceCard } from "@/components/ResourceCard";

export const ResourceTracker: React.FC = () => {
  const { resources, loading, currentFilter, setCurrentFilter } = useResource();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Filter resources based on the selected filter
  const filteredResources = resources.filter(resource => {
    if (currentFilter === "all") return true;
    if (currentFilter === "classroom" && resource.type === "classroom") return true;
    if (currentFilter === "lab" && resource.type === "lab") return true;
    if (currentFilter === "available" && resource.currentStatus === "available") return true;
    if (currentFilter === "occupied" && resource.currentStatus === "occupied") return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              Resource Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={currentFilter} 
              onValueChange={(value) => setCurrentFilter(value as ResourceFilter)}
              className="mb-4"
            >
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all" className="flex items-center justify-center">
                  <Building className="h-4 w-4 mr-2" /> All
                </TabsTrigger>
                <TabsTrigger value="classroom" className="flex items-center justify-center">
                  <BookOpen className="h-4 w-4 mr-2" /> Classrooms
                </TabsTrigger>
                <TabsTrigger value="lab" className="flex items-center justify-center">
                  <Flask className="h-4 w-4 mr-2" /> Labs
                </TabsTrigger>
                <TabsTrigger value="available" className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" /> Available
                </TabsTrigger>
                <TabsTrigger value="occupied" className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" /> Occupied
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                Available: {resources.filter(r => r.currentStatus === "available").length}
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                Occupied: {resources.filter(r => r.currentStatus === "occupied").length}
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Maintenance: {resources.filter(r => r.currentStatus === "maintenance").length}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Select a date to view room schedules for that day.
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:w-72">
          <CardHeader>
            <CardTitle className="text-xl">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border shadow-sm"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              selectedDate={selectedDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ResourceTracker;
