
import React from "react";
import { UsersRound, BookOpen, BarChart3 } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 border-b animate-fade-in">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <UsersRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tight">Faculty Workload</h1>
              <p className="text-sm text-muted-foreground">Track and manage faculty teaching, lab, and meeting hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Academic Year 2023-2024</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Spring Semester</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
