
import React from "react";
import { FacultyMember } from "@/types/faculty";
import { useFaculty } from "@/context/FacultyContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface WorkloadEditorProps {
  faculty: FacultyMember;
}

export const WorkloadEditor: React.FC<WorkloadEditorProps> = ({ faculty }) => {
  const { updateWorkload } = useFaculty();
  const { id, workload } = faculty;

  const handleTeachingChange = (value: number[]) => {
    updateWorkload({ facultyId: id, field: "teachingHours", value: value[0] });
  };

  const handleLabChange = (value: number[]) => {
    updateWorkload({ facultyId: id, field: "labHours", value: value[0] });
  };

  const handleMeetingChange = (value: number[]) => {
    updateWorkload({ facultyId: id, field: "meetingHours", value: value[0] });
  };

  return (
    <div className="space-y-4 py-1">
      <h4 className="text-sm font-medium mb-3">Adjust Workload</h4>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={`teaching-${id}`} className="text-xs">Teaching Hours</Label>
            <span className="text-xs font-medium">{workload.teachingHours}</span>
          </div>
          <Slider
            id={`teaching-${id}`}
            min={0}
            max={24}
            step={1}
            defaultValue={[workload.teachingHours]}
            onValueChange={handleTeachingChange}
            className="py-1"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={`lab-${id}`} className="text-xs">Lab Hours</Label>
            <span className="text-xs font-medium">{workload.labHours}</span>
          </div>
          <Slider
            id={`lab-${id}`}
            min={0}
            max={24}
            step={1}
            defaultValue={[workload.labHours]}
            onValueChange={handleLabChange}
            className="py-1"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={`meeting-${id}`} className="text-xs">Meeting Hours</Label>
            <span className="text-xs font-medium">{workload.meetingHours}</span>
          </div>
          <Slider
            id={`meeting-${id}`}
            min={0}
            max={12}
            step={1}
            defaultValue={[workload.meetingHours]}
            onValueChange={handleMeetingChange}
            className="py-1"
          />
        </div>
      </div>
    </div>
  );
};
