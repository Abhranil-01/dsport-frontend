import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="rounded-none md:rounded-2xl overflow-hidden p-0 pb-6">
      {/* Image */}
      <Skeleton className="h-40 md:h-65 w-full bg-gray-400" />

      <CardContent className="pt-4 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-gray-600" />
        <Skeleton className="h-4 w-1/2 bg-gray-600" />

        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-5 w-20 bg-gray-600" />
          <Skeleton className="h-5 w-16 bg-gray-600" />
          <Skeleton className="h-5 w-12 bg-gray-600" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md bg-gray-600" />
      </CardFooter>
    </Card>
  );
}
