import { NavLink } from "react-router-dom";
import clsx from "clsx";
import todayIcon from "@/assets/navigation/today.webp";
import tasksIcon from "@/assets/navigation/tasks.webp";
import budgetIcon from "@/assets/navigation/budget.webp";
import mealsIcon from "@/assets/navigation/meals.webp";
import listsIcon from "@/assets/navigation/lists.webp";

/**
 * Bottom Navigation - Optimized for Mobile Ergonomics
 *
 * Design targets:
 * - 44px minimum touch targets (Apple HIG)
 * - Thumb-zone accessibility (frequent items centered)
 * - Clear visual feedback (active state with scale + color)
 * - Reduced item count for faster scanning
 *
 * Motion System:
 * - 150ms color transitions for smooth state changes
 * - Active indicator with smooth appearance
 * - Subtle 3% scale on press for tactile feedback
 * - Opacity transitions for icon states
 */
const navItems = [
  { path: "/", label: "Today", icon: todayIcon },
  { path: "/tasks", label: "Tasks", icon: tasksIcon },
  { path: "/budget", label: "Budget", icon: budgetIcon },
  { path: "/meals", label: "Meals", icon: mealsIcon },
  { path: "/shopping", label: "Lists", icon: listsIcon },
];

const BottomNav = () => (
  <nav
    aria-label="Primary"
    className="h-14 flex items-center justify-around px-2"
  >
    {navItems.map(({ path, label, icon }) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          clsx(
            "group relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-0.5",
            "transition-[transform,opacity] duration-150 ease-motion-out",
            "active:scale-[0.97]",
            "motion-reduce:transition-none motion-reduce:active:scale-100",
            isActive
              ? "text-primary"
              : "text-text-muted hover:text-text-primary"
          )
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={icon}
              alt=""
              width={22}
              height={22}
              loading="lazy"
              decoding="async"
              className={clsx(
                "w-[22px] h-[22px] object-contain transition-opacity duration-150 ease-motion-out",
                "group-hover:scale-105 motion-reduce:group-hover:scale-100",
                isActive ? "opacity-100 scale-105" : "opacity-70 group-hover:opacity-100"
              )}
            />
            <span className={clsx(
              "text-[10px] leading-none font-medium tracking-tight transition-colors duration-150",
              isActive && "font-semibold"
            )}>
              {label}
            </span>
            {/* Active Indicator - smooth appearance */}
            <span
              className={clsx(
                "absolute -top-px h-0.5 w-8 rounded-full bg-primary",
                "transition-[width,opacity] duration-200 ease-motion-out",
                isActive
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-0"
              )}
            />
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
