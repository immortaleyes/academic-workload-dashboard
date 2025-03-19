
import React from "react";
import { Resource, ResourceSchedule } from "@/types/faculty";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResource } from "@/context/ResourceContext";
import { format } from "date-fns";
import { Building, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResourceCardProps {
  resource: Resource;
  selectedDate: Date;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, selectedDate }) => {
  const { getNextAvailableTime, getResourceScheduleForDay } = useResource();
  const nextAvailable = getNextAvailableTime(resource.id);
  const daySchedule = getResourceScheduleForDay(resource.id, selectedDate);

  const getStatusBadge = () => {
    switch (resource.currentStatus) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Available Now
          </Badge>
        );
      case "occupied":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Occupied until {nextAvailable ? format(nextAvailable, "h:mm a") : "—"}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Under Maintenance
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {resource.name}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5" />
            {resource.building}, {resource.floor} Floor
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {resource.capacity} seats
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm font-medium mb-2">
          Schedule for {format(selectedDate, "EEEE, MMMM d")}:
        </div>
        
        {daySchedule.length === 0 ? (
          <div className="text-sm text-muted-foreground italic py-2">
            No bookings for this day
          </div>
        ) : (
          <div className="space-y-2">
            {daySchedule.map((slot) => (
              <div key={slot.id} className="rounded-md border p-2 text-sm">
                <div className="font-medium">{slot.title}</div>
                <div className="text-muted-foreground flex justify-between">
                  <span>{format(slot.startTime, "h:mm a")} - {format(slot.endTime, "h:mm a")}</span>
                  {slot.facultyName && <span>{slot.facultyName}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div>
          Equipment: {resource.equipment.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
};
