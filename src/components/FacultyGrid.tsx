
import React from "react";
import { FacultyMember } from "@/types/faculty";
import { FacultyCard } from "@/components/FacultyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface FacultyGridProps {
  faculty: FacultyMember[];
  isLoading: boolean;
}

export const FacultyGrid: React.FC<FacultyGridProps> = ({ faculty, isLoading }) => {
  // Create 6 skeleton cards for loading state
  const skeletonCards = Array.from({ length: 6 }).map((_, i) => (
    <SkeletonCard key={i} />
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading
        ? skeletonCards
        : faculty.map((member) => (
            <FacultyCard key={member.id} faculty={member} />
          ))}
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
    <div className="p-4">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="h-[180px] w-full rounded-md" />
      </div>
      <Skeleton className="h-[1px] w-full my-4" />
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
