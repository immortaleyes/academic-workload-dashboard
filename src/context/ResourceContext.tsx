
import React, { createContext, useContext, useState, useEffect } from "react";
import { Resource, ResourceFilter, ResourceSchedule } from "@/types/faculty";
import { getUpdatedResources } from "@/lib/resourceData";
import { toast } from "@/components/ui/use-toast";
import { addMinutes, format, isWithinInterval } from "date-fns";

interface ResourceContextType {
  resources: Resource[];
  loading: boolean;
  currentFilter: ResourceFilter;
  setCurrentFilter: (filter: ResourceFilter) => void;
  getNextAvailableTime: (resourceId: string) => Date | null;
  getResourceScheduleForDay: (resourceId: string, date: Date) => ResourceSchedule[];
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<ResourceFilter>("all");

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setResources(getUpdatedResources());
      setLoading(false);
    }, 1000);

    // Update resources status every minute
    const statusInterval = setInterval(() => {
      setResources(getUpdatedResources());
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
    };
  }, []);

  const getNextAvailableTime = (resourceId: string): Date | null => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const now = new Date();
    
    // If resource is available now, return current time
    if (resource.currentStatus === "available") {
      return now;
    }
    
    // Sort schedules by end time
    const sortedSchedules = [...resource.schedule].sort((a, b) => 
      a.endTime.getTime() - b.endTime.getTime()
    );
    
    // Find the schedule that ends next
    const currentOrNextSchedule = sortedSchedules.find(s => 
      s.endTime > now
    );
    
    return currentOrNextSchedule ? currentOrNextSchedule.endTime : null;
  };

  const getResourceScheduleForDay = (resourceId: string, date: Date): ResourceSchedule[] => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return [];
    
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return resource.schedule.filter(s => 
      (s.startTime >= day && s.startTime < nextDay) || 
      (s.endTime > day && s.endTime <= nextDay) ||
      (s.startTime <= day && s.endTime >= nextDay)
    );
  };

  return (
    <ResourceContext.Provider value={{ 
      resources, 
      loading, 
      currentFilter, 
      setCurrentFilter,
      getNextAvailableTime,
      getResourceScheduleForDay
    }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
};
