import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col border-[0.1px] border-border/2">
      <CardHeader className="p-0">
        <Skeleton className="h-20 sm:h-24 md:h-28 w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="flex-1 p-1.5 sm:p-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex flex-row">
          <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-r-lg flex-shrink-0" />
          <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between min-w-0">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}




