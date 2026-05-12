import { useMemo, useCallback } from "react";
import { getToday, toDateString } from "@/shared/lib/date";

interface Props {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const CalendarStrip = ({ selectedDate, onDateSelect }: Props) => {
  const today = getToday();
  
  const dates = useMemo(() => {
    const result = [];
    const currentDate = new Date(today);
    
    // Generate 14 days starting from today
    for (let i = 0; i < 14; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      result.push({
        dateStr: toDateString(date),
        dayName: i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: date.getDate(),
        isToday: i === 0,
      });
    }
    
    return result;
  }, [today]);

  const handleDateSelect = useCallback((date: string) => {
    onDateSelect(date);
  }, [onDateSelect]);

  return (
    <div className="px-4 py-2 bg-background border-b border-border">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {dates.map(({ dateStr, dayName, dayNum, isToday }) => (
          <button
            key={dateStr}
            onClick={() => handleDateSelect(dateStr)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-[60px]
              transition-colors duration-200
              ${selectedDate === dateStr 
                ? "bg-primary text-on-primary" 
                : isToday 
                  ? "bg-muted opacity-50 text-foreground"
                  : "bg-muted opacity-30 text-muted hover:bg-muted hover:opacity-50"
              }
            `}
          >
            <span className="text-xs font-medium mb-1">{dayName}</span>
            <span className="text-lg font-semibold">{dayNum}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
