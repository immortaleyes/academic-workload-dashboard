
import React from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Calendar, Users } from "lucide-react";
import { ScheduleNotifications } from "@/components/ScheduleNotifications";

export const Header: React.FC = () => {
  const { faculty } = useFaculty();
  
  return (
    <header className="bg-white border-b">
      <div className="container py-4 px-6 mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Faculty Workload Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{faculty.length} Faculty Members</span>
            </div>
            
            <ScheduleNotifications />
          </div>
        </div>
      </div>
    </header>
  );
};
