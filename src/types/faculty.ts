
export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  email: string;
  position: string;
  image?: string;
  workload: Workload;
  schedule: ScheduleEntry[];
}

export interface Workload {
  teachingHours: number;
  labHours: number;
  meetingHours: number;
}

export interface WorkloadUpdate {
  facultyId: string;
  field: keyof Workload;
  value: number;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  type: "teaching" | "lab" | "meeting";
  startTime: Date;
  endTime: Date;
  location?: string; // Room where the activity takes place
}

export type TimeSlot = {
  day: string;
  start: string;
  end: string;
};

export type AvailabilityFilter = "day" | "week" | "month";

// Resource tracking types
export interface Resource {
  id: string;
  name: string;
  type: "classroom" | "lab";
  capacity: number;
  building: string;
  floor: string;
  equipment: string[];
  currentStatus: ResourceStatus;
  schedule: ResourceSchedule[];
}

export type ResourceStatus = "available" | "occupied" | "maintenance";

export interface ResourceSchedule {
  id: string;
  resourceId: string;
  facultyId?: string;
  facultyName?: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: "class" | "lab" | "meeting" | "maintenance";
}

export type ResourceFilter = "all" | "classroom" | "lab" | "available" | "occupied";
