
export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  email: string;
  position: string;
  image?: string;
  workload: Workload;
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
