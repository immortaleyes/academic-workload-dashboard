
import React from "react";
import { FacultyProvider } from "@/context/FacultyContext";
import { useFaculty } from "@/context/FacultyContext";
import { Header } from "@/components/Header";
import { FacultyGrid } from "@/components/FacultyGrid";
import { WorkloadSummary } from "@/components/WorkloadSummary";

const Dashboard: React.FC = () => {
  const { faculty, loading } = useFaculty();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-4 lg:col-span-1">
            <WorkloadSummary faculty={faculty} />
          </div>
          
          <div className="md:col-span-4 lg:col-span-3">
            <FacultyGrid faculty={faculty} isLoading={loading} />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container px-6 mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Faculty Workload Dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} University Administration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <FacultyProvider>
      <Dashboard />
    </FacultyProvider>
  );
};

export default Index;
