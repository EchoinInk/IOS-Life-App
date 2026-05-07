import { Bell, Menu } from "lucide-react";

export interface HomeHeaderProps {
  greeting: string;
}

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

/**
 * HomeHeader — compact top bar.
 * Single-line greeting + date, restrained icons. No oversized chrome.
 */
export const HomeHeader = ({ greeting }: HomeHeaderProps) => (
  <header className="flex items-center justify-between gap-3 -mx-1 px-1 pt-1">
    <button
      type="button"
      aria-label="Open menu"
      className="w-9 h-9 -ml-1.5 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors active:scale-95"
    >
      <Menu size={18} />
    </button>

    <div className="flex-1 min-w-0 text-center sm:text-left">
      <h1 className="text-[15px] font-semibold tracking-tight text-text-primary leading-none truncate">
        {greeting}
      </h1>
      <p className="text-[11px] text-text-muted mt-1 leading-none truncate">
        {formatToday()}
      </p>
    </div>

    <button
      type="button"
      aria-label="Notifications"
      className="w-9 h-9 -mr-1.5 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors active:scale-95"
    >
      <Bell size={18} />
    </button>
  </header>
);
