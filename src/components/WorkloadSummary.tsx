
import React, { useMemo } from "react";
import { FacultyMember } from "@/types/faculty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Flask, Users } from "lucide-react";

interface WorkloadSummaryProps {
  faculty: FacultyMember[];
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({ faculty }) => {
  const summaryData = useMemo(() => {
    if (!faculty.length) return { teaching: 0, lab: 0, meeting: 0, total: 0 };
    
    const totals = faculty.reduce(
      (acc, member) => {
        acc.teaching += member.workload.teachingHours;
        acc.lab += member.workload.labHours;
        acc.meeting += member.workload.meetingHours;
        return acc;
      },
      { teaching: 0, lab: 0, meeting: 0 }
    );
    
    totals.total = totals.teaching + totals.lab + totals.meeting;
    
    return totals;
  }, [faculty]);
  
  const teachingPercent = Math.round((summaryData.teaching / summaryData.total) * 100) || 0;
  const labPercent = Math.round((summaryData.lab / summaryData.total) * 100) || 0;
  const meetingPercent = Math.round((summaryData.meeting / summaryData.total) * 100) || 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Workload Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Teaching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{summaryData.teaching} hours</span>
                <span className="text-xs text-muted-foreground">({teachingPercent}%)</span>
              </div>
            </div>
            <Progress value={teachingPercent} className="h-2" indicatorClassName="bg-blue-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flask className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Lab Work</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{summaryData.lab} hours</span>
                <span className="text-xs text-muted-foreground">({labPercent}%)</span>
              </div>
            </div>
            <Progress value={labPercent} className="h-2" indicatorClassName="bg-green-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{summaryData.meeting} hours</span>
                <span className="text-xs text-muted-foreground">({meetingPercent}%)</span>
              </div>
            </div>
            <Progress value={meetingPercent} className="h-2" indicatorClassName="bg-amber-500" />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Faculty Workload</span>
            <span className="text-lg font-semibold">{summaryData.total} hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
