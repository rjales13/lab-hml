import { iDashboardProps } from '@/models/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = ({ isAdmin }: iDashboardProps) => {
  const cardsToShow = isAdmin ? 3 : 2;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-100" />
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: cardsToShow }).map((_, i) => (
          <Card
            key={i}
            className="relative overflow-hidden border-slate-200 transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                </div>
                <Skeleton className="mt-4 h-4 w-32" />
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
