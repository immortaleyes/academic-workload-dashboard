
import { Resource, ResourceStatus } from "@/types/faculty";
import { addDays, addHours, setHours, setMinutes, startOfDay } from "date-fns";

// Helper to create resource schedules
const createResourceSchedule = (baseDate: Date, resourceId: string) => {
  const today = startOfDay(baseDate);
  const tomorrow = addDays(today, 1);
  
  // Create different schedules for each resource
  switch(resourceId) {
    case "r1": // CS Lab 101
      return [
        {
          id: `${resourceId}-1`,
          resourceId: resourceId,
          facultyId: "f1",
          facultyName: "Dr. Emily Chen",
          title: "Programming Lab",
          startTime: setHours(setMinutes(today, 0), 14),
          endTime: setHours(setMinutes(today, 0), 17),
          type: "lab" as const
        },
        {
          id: `${resourceId}-2`,
          resourceId: resourceId,
          facultyId: "f3",
          facultyName: "Dr. Sarah Johnson",
          title: "Physics Lab",
          startTime: setHours(setMinutes(tomorrow, 0), 10),
          endTime: setHours(setMinutes(tomorrow, 0), 13),
          type: "lab" as const
        }
      ];
    case "r2": // Lecture Hall A
      return [
        {
          id: `${resourceId}-1`,
          resourceId: resourceId,
          facultyId: "f1",
          facultyName: "Dr. Emily Chen",
          title: "Algorithms Lecture",
          startTime: setHours(setMinutes(today, 0), 9),
          endTime: setHours(setMinutes(today, 0), 11),
          type: "class" as const
        },
        {
          id: `${resourceId}-2`,
          resourceId: resourceId,
          facultyId: "f2",
          facultyName: "Prof. David Williams",
          title: "Calculus Lecture",
          startTime: setHours(setMinutes(today, 0), 12),
          endTime: setHours(setMinutes(today, 0), 14),
          type: "class" as const
        }
      ];
    case "r3": // Physics Lab 201
      return [
        {
          id: `${resourceId}-1`,
          resourceId: resourceId,
          title: "Maintenance",
          startTime: setHours(setMinutes(today, 0), 8),
          endTime: setHours(setMinutes(today, 0), 10),
          type: "maintenance" as const
        }
      ];
    default:
      return [];
  }
};

// Function to determine the current status of a resource
const determineResourceStatus = (schedules: any[], currentTime: Date): ResourceStatus => {
  for (const schedule of schedules) {
    if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
      if (schedule.type === "maintenance") {
        return "maintenance";
      }
      return "occupied";
    }
  }
  return "available";
};

// Create our base resource data
const baseDate = new Date();

export const resourceData: Resource[] = [
  {
    id: "r1",
    name: "CS Lab 101",
    type: "lab",
    capacity: 30,
    building: "Computer Science",
    floor: "1st",
    equipment: ["Computers", "Projector", "Whiteboards"],
    currentStatus: "available", // Will be updated based on schedule
    schedule: createResourceSchedule(baseDate, "r1")
  },
  {
    id: "r2",
    name: "Lecture Hall A",
    type: "classroom",
    capacity: 120,
    building: "Main Building",
    floor: "2nd",
    equipment: ["Projector", "Smart Board", "Audio System"],
    currentStatus: "available", // Will be updated based on schedule
    schedule: createResourceSchedule(baseDate, "r2")
  },
  {
    id: "r3",
    name: "Physics Lab 201",
    type: "lab",
    capacity: 25,
    building: "Science Building",
    floor: "2nd",
    equipment: ["Lab Equipment", "Safety Gear", "Computers"],
    currentStatus: "available", // Will be updated based on schedule
    schedule: createResourceSchedule(baseDate, "r3")
  },
  {
    id: "r4",
    name: "Seminar Room B",
    type: "classroom",
    capacity: 40,
    building: "Humanities",
    floor: "3rd",
    equipment: ["Projector", "Whiteboard"],
    currentStatus: "available",
    schedule: []
  },
  {
    id: "r5",
    name: "Chemistry Lab 102",
    type: "lab",
    capacity: 28,
    building: "Science Building",
    floor: "1st",
    equipment: ["Lab Equipment", "Safety Gear", "Fume Hoods"],
    currentStatus: "available",
    schedule: []
  }
];

// Update current status based on schedule
export const getUpdatedResources = () => {
  const currentTime = new Date();
  
  return resourceData.map(resource => ({
    ...resource,
    currentStatus: determineResourceStatus(resource.schedule, currentTime)
  }));
};
