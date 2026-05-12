import { Bell, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { HeroTitle, Meta, LabelSoft, Metric } from "@/components/ui/Text";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onBack?: () => void;
  showDatePill?: boolean;
  showTopBar?: boolean;
  /** Greeting line in the top bar (e.g. "Hi, Alex 👋"). Defaults to a generic greeting. */
  greeting?: string;
  /** Subtitle under the greeting in the top bar. */
  topBarSubtitle?: string;
  /** Show the unread indicator dot on the bell. */
  hasNotifications?: boolean;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md";

const Header = ({
  title,
  subtitle,
  selectedDate,
  onDateChange,
  onBack,
  showDatePill = false,
  showTopBar = false,
  greeting = "Hello 👋",
  topBarSubtitle = "Let's make today amazing",
  hasNotifications = false,
  onMenuClick,
  onNotificationsClick,
}: HeaderProps) => {
  const shift = (days: number) => {
    if (!selectedDate || !onDateChange) return;
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    onDateChange(next);
  };

  return (
    <header className="px-4 py-4 space-y-4">
      {/* TOP BAR — menu · greeting · notifications */}
      {showTopBar && (
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className={`p-3 -ml-2 text-foreground active:scale-95 transition ${focusRing} motion-reduce:active:scale-100`}
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 min-w-0">
            <HeroTitle tone="primary">{greeting}</HeroTitle>
            <Meta>{topBarSubtitle}</Meta>
          </div>

          <button
            type="button"
            aria-label={
              hasNotifications ? "Notifications (unread)" : "Notifications"
            }
            onClick={onNotificationsClick}
            className={`p-3 -mr-2 text-foreground active:scale-95 transition relative mt-1 ${focusRing} motion-reduce:active:scale-100`}
          >
            <Bell size={22} />
            {hasNotifications && (
              <span
                aria-hidden
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
              />
            )}
          </button>
        </div>
      )}

      {/* TITLE OR DATE PILL */}
      {showDatePill && selectedDate && onDateChange ? (
        <div className="flex items-center gap-2 px-4 rounded-full bg-surface-elevated border border-border shadow-sm">
          <button
            type="button"
            aria-label="Show previous day"
            onClick={() => shift(-1)}
            className={`p-2.5 text-text-secondary hover:text-text-primary hover:bg-hover-overlay rounded-lg transition-colors ${focusRing}`}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex-1 text-center">
            <LabelSoft className="font-bold text-text-primary">
              {formatDate(selectedDate)}
            </LabelSoft>
          </div>

          <button
            type="button"
            aria-label="Show next day"
            onClick={() => shift(1)}
            className={`p-2.5 text-text-secondary hover:text-text-primary hover:bg-hover-overlay rounded-lg transition-colors ${focusRing}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : title ? (
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className={`absolute left-0 p-2.5 hover:bg-surface-elevated rounded-lg active:scale-[0.98] transition-[background-color,transform] ${focusRing}`}
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <Metric className="text-xl">{title}</Metric>
          </div>

          {subtitle && (
            <div className="rounded-full px-4 py-1.5 text-center bg-surface-elevated border border-border shadow-sm">
              <Meta>{subtitle}</Meta>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
