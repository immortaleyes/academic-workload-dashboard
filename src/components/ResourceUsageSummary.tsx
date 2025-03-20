
import React, { useState } from "react";
import { useResource } from "@/context/ResourceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ResourceStatus } from "@/types/faculty";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Building, Clock } from "lucide-react";
import { format } from "date-fns";

export const ResourceUsageSummary: React.FC = () => {
  const { resources } = useResource();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Calculate resource statistics
  const totalResources = resources.length;
  const availableCount = resources.filter(r => r.currentStatus === "available").length;
  const occupiedCount = resources.filter(r => r.currentStatus === "occupied").length;
  const maintenanceCount = resources.filter(r => r.currentStatus === "maintenance").length;

  // Data for usage pie chart
  const usageData = [
    { name: "Available", value: availableCount, color: "#10b981" },
    { name: "Occupied", value: occupiedCount, color: "#f97316" },
    { name: "Maintenance", value: maintenanceCount, color: "#f59e0b" }
  ];

  // Calculate utilization percentage by room type
  const classrooms = resources.filter(r => r.type === "classroom");
  const labs = resources.filter(r => r.type === "lab");
  
  const classroomUsage = classrooms.length > 0 
    ? (classrooms.filter(r => r.currentStatus === "occupied").length / classrooms.length) * 100 
    : 0;
    
  const labUsage = labs.length > 0 
    ? (labs.filter(r => r.currentStatus === "occupied").length / labs.length) * 100 
    : 0;

  // Format resource status for display
  const getStatusBadgeClass = (status: ResourceStatus) => {
    switch(status) {
      case "available": return "bg-green-100 text-green-800";
      case "occupied": return "bg-orange-100 text-orange-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Resource Usage Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} resources (${Math.round(Number(value) * 100 / totalResources)}%)`, null]}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Resource Utilization Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Classrooms</span>
                  <span className="text-sm text-muted-foreground">
                    {classrooms.filter(r => r.currentStatus === "occupied").length} of {classrooms.length} in use
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${classroomUsage}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {Math.round(classroomUsage)}% utilization
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Labs</span>
                  <span className="text-sm text-muted-foreground">
                    {labs.filter(r => r.currentStatus === "occupied").length} of {labs.length} in use
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-500 h-2.5 rounded-full" 
                    style={{ width: `${labUsage}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {Math.round(labUsage)}% utilization
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Utilized Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources
              .filter(r => r.currentStatus === "occupied")
              .slice(0, 4)
              .map(resource => (
                <div key={resource.id} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{resource.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(resource.currentStatus)}`}>
                      {resource.currentStatus}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {resource.building}, Floor {resource.floor}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Capacity: {resource.capacity} | Type: {resource.type}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
