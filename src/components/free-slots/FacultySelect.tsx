
import React from "react";
import { FacultyMember } from "@/types/faculty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface FacultySelectProps {
  faculty: FacultyMember[];
  onFacultyChange: (facultyId: string) => void;
}

export const FacultySelect: React.FC<FacultySelectProps> = ({ faculty, onFacultyChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        Select Faculty Member
      </h3>
      <Select onValueChange={onFacultyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select faculty member" />
        </SelectTrigger>
        <SelectContent>
          {faculty.map(member => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
