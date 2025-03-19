
import React, { createContext, useContext, useState, useEffect } from "react";
import { FacultyMember, Workload, WorkloadUpdate, AvailabilityFilter, ScheduleEntry } from "@/types/faculty";
import { facultyData } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format } from "date-fns";

interface FacultyContextType {
  faculty: FacultyMember[];
  updateWorkload: (update: WorkloadUpdate) => void;
  loading: boolean;
  getAvailableSlots: (facultyId: string, filter: AvailabilityFilter) => { date: Date; available: boolean }[];
  currentFilter: AvailabilityFilter;
  setCurrentFilter: (filter: AvailabilityFilter) => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<AvailabilityFilter>("day");

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setFaculty(facultyData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const updateWorkload = (update: WorkloadUpdate) => {
    const { facultyId, field, value } = update;

    setFaculty((prevFaculty) => {
      return prevFaculty.map((member) => {
        if (member.id === facultyId) {
          const updatedWorkload = {
            ...member.workload,
            [field]: value,
          };
          
          // Notify about the update
          toast({
            title: "Workload Updated",
            description: `${member.name}'s ${field} has been updated to ${value} hours`,
            duration: 3000,
          });
          
          return {
            ...member,
            workload: updatedWorkload,
          };
        }
        return member;
      });
    });
  };

  const isTimeSlotAvailable = (facultyMember: FacultyMember, date: Date): boolean => {
    // Get the start and end of the hour for the given date
    const hourStart = new Date(date);
    const hourEnd = new Date(date);
    hourEnd.setHours(hourEnd.getHours() + 1);

    // Check if any scheduled events overlap with this hour
    const hasConflict = facultyMember.schedule.some(event => {
      return isWithinInterval(hourStart, { start: event.startTime, end: event.endTime }) ||
             isWithinInterval(hourEnd, { start: event.startTime, end: event.endTime }) ||
             (hourStart <= event.startTime && hourEnd >= event.endTime);
    });

    return !hasConflict;
  };

  const getAvailableSlots = (facultyId: string, filter: AvailabilityFilter) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (!facultyMember) return [];

    const currentDate = new Date();
    let startDate: Date, endDate: Date;

    // Set date range based on filter
    switch(filter) {
      case "day":
        startDate = startOfDay(currentDate);
        endDate = endOfDay(currentDate);
        break;
      case "week":
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      default:
        startDate = startOfDay(currentDate);
        endDate = endOfDay(currentDate);
    }

    // Working hours typically 8am-5pm
    const workdayStartHour = 8;
    const workdayEndHour = 17;
    
    const slots: { date: Date; available: boolean }[] = [];
    
    // Iterate through each day in the range
    const currentIterationDate = new Date(startDate);
    while (currentIterationDate <= endDate) {
      const dayOfWeek = currentIterationDate.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Iterate through each hour of the working day
        for (let hour = workdayStartHour; hour < workdayEndHour; hour++) {
          const slotDate = new Date(currentIterationDate);
          slotDate.setHours(hour, 0, 0, 0);
          
          // Check if this time slot is available
          const available = isTimeSlotAvailable(facultyMember, slotDate);
          
          slots.push({
            date: slotDate,
            available
          });
        }
      }
      
      // Move to the next day
      currentIterationDate.setDate(currentIterationDate.getDate() + 1);
    }
    
    return slots;
  };

  return (
    <FacultyContext.Provider value={{ 
      faculty, 
      updateWorkload, 
      loading, 
      getAvailableSlots,
      currentFilter,
      setCurrentFilter
    }}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
};
