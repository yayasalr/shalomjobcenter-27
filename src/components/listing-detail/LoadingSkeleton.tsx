
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <Skeleton className="h-8 w-2/3 sm:w-1/3 mb-4" />
    <Skeleton className="h-4 w-1/2 sm:w-1/4 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <Skeleton className="h-[300px] md:h-[450px] rounded-lg md:col-span-8" />
      <div className="grid grid-cols-2 gap-4 md:col-span-4">
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </div>
      <div>
        <Skeleton className="h-[380px] rounded-lg" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
