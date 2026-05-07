import { type ReactNode } from "react";
import BottomNav from "@/components/layout/BottomNav";

interface AppShellProps {
  children: ReactNode;
}

/**
 * App Shell - Mobile-Optimized Layout Container
 *
 * Ergonomic features:
 * - Safe area support for notched devices
 * - Fixed bottom nav in thumb zone
 * - Max-width constraint for larger screens
 * - Proper z-index layering for overlays
 */
const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-background">
    {/* CONTENT AREA - With bottom padding for nav */}
    <div className="w-full max-w-[430px] mx-auto pb-[calc(56px+env(safe-area-inset-bottom))]">
      <main className="min-h-screen">
        {children}
      </main>
    </div>

    {/* BOTTOM NAV - Fixed in thumb zone */}
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="
          w-full max-w-[430px]
          pointer-events-auto
          bg-background/95
          backdrop-blur-sm
          border-t border-border
          shadow-lg shadow-black/5
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <BottomNav />
      </div>
    </div>
  </div>
);

export default AppShell;
