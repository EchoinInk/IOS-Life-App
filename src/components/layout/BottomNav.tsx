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
            "transition-colors duration-150",
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
                "w-[22px] h-[22px] object-contain transition-opacity",
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}
            />
            <span className="text-[10px] leading-none font-medium tracking-tight">
              {label}
            </span>
            {isActive && (
              <span className="absolute -top-px h-0.5 w-8 rounded-full bg-primary" />
            )}
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
