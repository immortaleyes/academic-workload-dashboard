
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface AvailableSlotsDisplayProps {
  availableSlots: { date: Date; available: boolean }[];
  filter: string;
}

export const AvailableSlotsDisplay: React.FC<AvailableSlotsDisplayProps> = ({ 
  availableSlots, 
  filter 
}) => {
  const filteredSlots = availableSlots.filter(slot => slot.available);

  return (
    <div className="pt-4">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        Available Time Slots ({filter})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredSlots.map((slot, index) => (
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
          
        {filteredSlots.length === 0 && (
          <div className="col-span-full text-center py-4 text-muted-foreground">
            No available slots found for the selected time range
          </div>
        )}
      </div>
    </div>
  );
};
