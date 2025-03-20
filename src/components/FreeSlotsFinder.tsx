
import React, { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

export const FreeSlotsFinder: React.FC = () => {
  const { faculty, getAvailableSlots, currentFilter } = useFaculty();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ date: Date; available: boolean }[]>([]);

  const handleFacultyChange = (facultyId: string) => {
    setSelectedFaculty(facultyId);
    const slots = getAvailableSlots(facultyId, currentFilter);
    setAvailableSlots(slots);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Free Slots Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={handleFacultyChange}>
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

            {selectedFaculty && (
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Available Time Slots ({currentFilter})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableSlots
                    .filter(slot => slot.available)
                    .map((slot, index) => (
                      <div 
                        key={index} 
                        className="border rounded-md p-2 bg-green-50 flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {format(slot.date, "EEE, MMM d • h:mm a")}
                        </span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Free
                        </Badge>
                      </div>
                    ))}
                    
                  {availableSlots.filter(slot => slot.available).length === 0 && (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      No available slots found for the selected time range
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
