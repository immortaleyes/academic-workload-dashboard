
import React from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Calendar, Users } from "lucide-react";
import { ScheduleNotifications } from "@/components/ScheduleNotifications";

export const Header: React.FC = () => {
  const { faculty } = useFaculty();
  
  // Count faculty with high workload (more than 25 hours)
  const overloadedFaculty = faculty.filter(f => 
    (f.workload.teachingHours + f.workload.labHours + f.workload.meetingHours) > 25
  ).length;
  
  return (
    <header className="bg-white border-b">
      <div className="container py-4 px-6 mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">HOD Faculty Workload Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{faculty.length} Faculty Members</span>
            </div>
            
            {overloadedFaculty > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                {overloadedFaculty} Overloaded
              </Badge>
            )}
            
            <ScheduleNotifications />
          </div>
        </div>
      </div>
    </header>
  );
};
