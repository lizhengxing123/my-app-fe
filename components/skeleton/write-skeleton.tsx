import { Skeleton } from "@/components/ui/skeleton";

export default function WritePageSkeleton() {
  return (
    <div className="w-full h-full flex space-x-8 justify-center pt-4">
      <div className="flex flex-col w-1/2 space-y-8">
        <div className="flex w-full space-x-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-sm" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-12 w-4/5 rounded-xl" />
        <Skeleton className="h-12 w-3/5 rounded-xl" />
        <Skeleton className="h-12 w-2/5 rounded-xl" />
      </div>
      <div className="flex flex-col w-1/2 space-y-8">
        <Skeleton className="h-12 w-3/5 rounded-xl" />
        <Skeleton className="h-12 w-3/5 rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-12 w-4/5 rounded-xl" />
        <Skeleton className="h-12 w-4/5 rounded-xl" />
      </div>
    </div>
  );
}
