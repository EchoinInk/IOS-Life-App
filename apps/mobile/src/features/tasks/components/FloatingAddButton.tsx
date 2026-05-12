import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

/**
 * Floating Add Button - Optimized for Mobile Ergonomics
 *
 * Positioned in the natural thumb zone for right-handed users.
 * Large touch target with haptic-style visual feedback.
 */
export const FloatingAddButton = ({ onClick }: Props) => {
  return (
    <div className="fixed bottom-[100px] right-4 sm:bottom-8 sm:right-8 z-40">
      <button
        onClick={onClick}
        className="
          w-14 h-14 sm:w-16 sm:h-16
          bg-primary text-text-on-primary
          rounded-full
          shadow-lg shadow-primary/20
          flex items-center justify-center
          transition-[filter,transform] duration-200 ease-motion-out
          hover:brightness-110 hover:scale-105 motion-reduce:hover:scale-100
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2
          motion-reduce:transition-none
        "
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
};
