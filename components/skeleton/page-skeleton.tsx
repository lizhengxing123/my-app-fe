import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <div className="flex space-x-4 justify-center pt-4">
      <div className="w-3/5 space-y-6">
        <div className="flex items-center w-full space-x-3">
          <Skeleton className="h-10 w-10 flex-none rounded-full" />
          <Skeleton className="h-10 w-32 flex-1" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-6 w-2/5" />
        </div>
      </div>
      <div className="w-1/5">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
