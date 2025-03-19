
import { FacultyMember } from "@/types/faculty";
import { addDays, addHours, startOfDay, setHours, setMinutes } from "date-fns";

// Helper to create schedule entries
const createSchedule = (baseDate: Date, facultyId: string) => {
  const today = startOfDay(baseDate);
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  
  // Create different schedules for each faculty member
  switch(facultyId) {
    case "f1": // Dr. Emily Chen
      return [
        {
          id: `${facultyId}-1`,
          title: "Algorithms Lecture",
          type: "teaching" as const,
          startTime: setHours(setMinutes(today, 0), 9),
          endTime: setHours(setMinutes(today, 0), 11),
        },
        {
          id: `${facultyId}-2`,
          title: "Programming Lab",
          type: "lab" as const,
          startTime: setHours(setMinutes(today, 0), 14),
          endTime: setHours(setMinutes(today, 0), 17),
        },
        {
          id: `${facultyId}-3`,
          title: "Faculty Meeting",
          type: "meeting" as const,
          startTime: setHours(setMinutes(tomorrow, 0), 10),
          endTime: setHours(setMinutes(tomorrow, 0), 12),
        },
      ];
    case "f2": // Prof. David Williams
      return [
        {
          id: `${facultyId}-1`,
          title: "Calculus Lecture",
          type: "teaching" as const,
          startTime: setHours(setMinutes(today, 0), 10),
          endTime: setHours(setMinutes(today, 0), 12),
        },
        {
          id: `${facultyId}-2`,
          title: "Linear Algebra",
          type: "teaching" as const,
          startTime: setHours(setMinutes(tomorrow, 0), 14),
          endTime: setHours(setMinutes(tomorrow, 0), 16),
        },
        {
          id: `${facultyId}-3`,
          title: "Department Meeting",
          type: "meeting" as const,
          startTime: setHours(setMinutes(dayAfter, 0), 9),
          endTime: setHours(setMinutes(dayAfter, 0), 11),
        },
      ];
    default:
      return [
        {
          id: `${facultyId}-1`,
          title: `${facultyId} Class`,
          type: "teaching" as const,
          startTime: addHours(today, 9),
          endTime: addHours(today, 11),
        },
        {
          id: `${facultyId}-2`,
          title: `${facultyId} Lab`,
          type: "lab" as const,
          startTime: addHours(tomorrow, 13),
          endTime: addHours(tomorrow, 15),
        },
      ];
  }
};

// Create our base faculty data
const baseDate = new Date();

export const facultyData: FacultyMember[] = [
  {
    id: "f1",
    name: "Dr. Emily Chen",
    department: "Computer Science",
    email: "emily.chen@university.edu",
    position: "Associate Professor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 12,
      labHours: 6,
      meetingHours: 4
    },
    schedule: createSchedule(baseDate, "f1")
  },
  {
    id: "f2",
    name: "Prof. David Williams",
    department: "Mathematics",
    email: "david.williams@university.edu",
    position: "Full Professor",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 16,
      labHours: 0,
      meetingHours: 8
    },
    schedule: createSchedule(baseDate, "f2")
  },
  {
    id: "f3",
    name: "Dr. Sarah Johnson",
    department: "Physics",
    email: "sarah.johnson@university.edu",
    position: "Assistant Professor",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 10,
      labHours: 8,
      meetingHours: 3
    },
    schedule: createSchedule(baseDate, "f3")
  },
  {
    id: "f4",
    name: "Prof. Michael Brown",
    department: "Chemistry",
    email: "michael.brown@university.edu",
    position: "Associate Professor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 14,
      labHours: 10,
      meetingHours: 5
    },
    schedule: createSchedule(baseDate, "f4")
  },
  {
    id: "f5",
    name: "Dr. Lisa Rodriguez",
    department: "Biology",
    email: "lisa.rodriguez@university.edu",
    position: "Full Professor",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 8,
      labHours: 12,
      meetingHours: 6
    },
    schedule: createSchedule(baseDate, "f5")
  },
  {
    id: "f6",
    name: "Prof. James Wilson",
    department: "Electrical Engineering",
    email: "james.wilson@university.edu",
    position: "Assistant Professor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
    workload: {
      teachingHours: 9,
      labHours: 14,
      meetingHours: 2
    },
    schedule: createSchedule(baseDate, "f6")
  }
];
