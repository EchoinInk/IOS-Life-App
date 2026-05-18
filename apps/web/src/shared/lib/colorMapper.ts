/**
 * Shared color mapper utility
 * Converts semantic color values to Tailwind CSS classes
 */

export const getColorClasses = (color: string) => {
  return {
    bg: `bg-${color}`,
    text: `text-${color}`,
    border: `border-${color}`,
  };
};
