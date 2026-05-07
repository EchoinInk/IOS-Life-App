import { type ReactNode } from "react";
import BottomNav from "@/components/layout/BottomNav";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-background">
    
    {/* CONTENT */}
    <div className="w-full max-w-[430px] mx-auto">
      <main>
        {children}
      </main>
    </div>

    {/* NAV */}
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="
          w-full max-w-[430px]
          pointer-events-auto
          bg-background
          border-t border-border
          shadow-lg
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <BottomNav />
      </div>
    </div>
  </div>
);

export default AppShell;
