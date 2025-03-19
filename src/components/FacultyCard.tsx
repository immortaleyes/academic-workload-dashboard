
import React from "react";
import { FacultyMember } from "@/types/faculty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { WorkloadChart } from "@/components/WorkloadChart";
import { WorkloadEditor } from "@/components/WorkloadEditor";

interface FacultyCardProps {
  faculty: FacultyMember;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  const { name, department, position, email, workload, image } = faculty;
  
  const totalHours = workload.teachingHours + workload.labHours + workload.meetingHours;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg animate-scale-in">
      <CardHeader className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium text-lg leading-none">{name}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="font-normal">
                {position}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {department}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Current Workload</h4>
            <Badge variant="outline" className="font-semibold">
              {totalHours} hours total
            </Badge>
          </div>
          <Separator className="my-2" />
          <div className="h-[180px] pt-2">
            <WorkloadChart workload={workload} />
          </div>
        </div>
        
        <Separator className="my-1" />
        
        <WorkloadEditor faculty={faculty} />
      </CardContent>
    </Card>
  );
};
