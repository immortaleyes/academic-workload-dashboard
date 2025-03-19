
import React, { createContext, useContext, useState, useEffect } from "react";
import { FacultyMember, Workload, WorkloadUpdate } from "@/types/faculty";
import { facultyData } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";

interface FacultyContextType {
  faculty: FacultyMember[];
  updateWorkload: (update: WorkloadUpdate) => void;
  loading: boolean;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setFaculty(facultyData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const updateWorkload = (update: WorkloadUpdate) => {
    const { facultyId, field, value } = update;

    setFaculty((prevFaculty) => {
      return prevFaculty.map((member) => {
        if (member.id === facultyId) {
          const updatedWorkload = {
            ...member.workload,
            [field]: value,
          };
          
          // Notify about the update
          toast({
            title: "Workload Updated",
            description: `${member.name}'s ${field} has been updated to ${value} hours`,
            duration: 3000,
          });
          
          return {
            ...member,
            workload: updatedWorkload,
          };
        }
        return member;
      });
    });
  };

  return (
    <FacultyContext.Provider value={{ faculty, updateWorkload, loading }}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
};
