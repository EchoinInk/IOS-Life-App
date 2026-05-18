import { useEffect, useState } from "react";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-[430px] mx-auto px-4 pt-4 space-y-6">
          {/* Header skeleton */}
          <div className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 bg-muted opacity-20 rounded-md animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-6 bg-muted opacity-20 rounded animate-pulse" />
                <div className="h-4 bg-muted opacity-20 rounded animate-pulse w-3/4" />
              </div>
              <div className="w-11 h-11 bg-muted opacity-20 rounded-md animate-pulse" />
            </div>
          </div>
          {/* Hero skeleton */}
          <div className="h-32 bg-muted opacity-20 rounded-xl animate-pulse" />
          {/* Summary skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-muted opacity-20 rounded-xl animate-pulse" />
            <div className="h-20 bg-muted opacity-20 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
