
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
}

export type TimeSlot = {
  day: string;
  start: string;
  end: string;
};

export type AvailabilityFilter = "day" | "week" | "month";
