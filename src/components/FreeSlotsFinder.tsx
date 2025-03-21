
import React, { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { FacultySelect } from "./free-slots/FacultySelect";
import { AvailableSlotsDisplay } from "./free-slots/AvailableSlotsDisplay";

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
            <FacultySelect 
              faculty={faculty} 
              onFacultyChange={handleFacultyChange} 
            />

            {selectedFaculty && (
              <AvailableSlotsDisplay 
                availableSlots={availableSlots} 
                filter={currentFilter} 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
