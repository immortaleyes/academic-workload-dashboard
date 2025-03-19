
import React, { useState } from "react";
import { useResource } from "@/context/ResourceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceFilter } from "@/types/faculty";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, BookOpen, Beaker, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ResourceCard } from "@/components/ResourceCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const ResourceTracker: React.FC = () => {
  const { resources, loading, currentFilter, setCurrentFilter } = useResource();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredResources = resources.filter(resource => {
    if (currentFilter === "all") return true;
    if (currentFilter === "classroom" && resource.type === "classroom") return true;
    if (currentFilter === "lab" && resource.type === "lab") return true;
    if (currentFilter === "available" && resource.currentStatus === "available") return true;
    if (currentFilter === "occupied" && resource.currentStatus === "occupied") return true;
    return false;
  });
  
  // Calculate resource utilization statistics
  const totalResources = resources.length;
  const classroomCount = resources.filter(r => r.type === "classroom").length;
  const labCount = resources.filter(r => r.type === "lab").length;
  
  const availableCount = resources.filter(r => r.currentStatus === "available").length;
  const occupiedCount = resources.filter(r => r.currentStatus === "occupied").length;
  const maintenanceCount = resources.filter(r => r.currentStatus === "maintenance").length;
  
  // Prepare data for utilization chart
  const utilizationData = [
    { name: "Available", value: availableCount, color: "#10b981" },
    { name: "Occupied", value: occupiedCount, color: "#f97316" },
    { name: "Maintenance", value: maintenanceCount, color: "#f59e0b" }
  ];
  
  const resourceTypeData = [
    { name: "Classrooms", value: classroomCount, color: "#3b82f6" },
    { name: "Labs", value: labCount, color: "#8b5cf6" }
  ];

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
                  <Beaker className="h-4 w-4 mr-2" /> Labs
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
      
      {/* Add Resource Utilization Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Resource Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} resources`, null]}
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '8px 12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              Resource Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {resourceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} resources`, null]}
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '8px 12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-1.5 text-blue-500" />
                    Classrooms
                  </span>
                  <span className="text-sm text-muted-foreground">{classroomCount} total</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Beaker className="h-4 w-4 mr-1.5 text-purple-500" />
                    Labs
                  </span>
                  <span className="text-sm text-muted-foreground">{labCount} total</span>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Utilization Rate</span>
                  <span className="text-sm font-semibold">
                    {Math.round((occupiedCount / totalResources) * 100) || 0}% in use
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${Math.round((occupiedCount / totalResources) * 100) || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
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
