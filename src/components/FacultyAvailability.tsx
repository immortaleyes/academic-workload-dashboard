
import React from "react";
import { format } from "date-fns";
import { AvailabilityFilter, FacultyMember } from "@/types/faculty";
import { useFaculty } from "@/context/FacultyContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Calendar, Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FacultyAvailabilityProps {
  faculty: FacultyMember;
}

export const FacultyAvailability: React.FC<FacultyAvailabilityProps> = ({ faculty }) => {
  const { getAvailableSlots, currentFilter, setCurrentFilter } = useFaculty();
  const availableSlots = getAvailableSlots(faculty.id, currentFilter);
  
  // Group slots by day for cleaner presentation
  const slotsByDay = availableSlots.reduce((acc, slot) => {
    const day = format(slot.date, 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, typeof availableSlots>);

  const renderAvailabilityTable = () => {
    return (
      <div className="mt-4 overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(slotsByDay).map(([day, slots]) => (
              <React.Fragment key={day}>
                {slots.map((slot, index) => (
                  <TableRow key={`${day}-${index}`}>
                    {index === 0 && (
                      <TableCell rowSpan={slots.length} className="align-top font-medium">
                        {format(slot.date, 'E, MMM d')}
                      </TableCell>
                    )}
                    <TableCell>{format(slot.date, 'h:mm a')}</TableCell>
                    <TableCell className="text-right">
                      {slot.available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> 
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <X className="mr-1 h-3 w-3" /> 
                          Busy
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Availability Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue={currentFilter} onValueChange={(value) => setCurrentFilter(value as AvailabilityFilter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" /> Day
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" /> Week
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" /> Month
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="mt-2">
            {renderAvailabilityTable()}
          </TabsContent>
          
          <TabsContent value="week" className="mt-2">
            {renderAvailabilityTable()}
          </TabsContent>
          
          <TabsContent value="month" className="mt-2">
            {renderAvailabilityTable()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
