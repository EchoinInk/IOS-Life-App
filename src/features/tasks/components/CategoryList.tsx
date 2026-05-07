import { getCategoryMetadata } from "@/features/tasks/domain/taskDomain";
import { getColorClasses } from "@/shared/lib/colorMapper";

interface CategorySummary {
  category: string;
  active: number;
  total: number;
  completed: number;
}

interface CategoryListProps {
  categories: CategorySummary[];
  onCategoryClick?: (category: string) => void;
}

export const CategoryList = ({ categories }: CategoryListProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-muted text-sm">
        No categories yet 🎉
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {categories.map(({ category, active, total, completed }) => {
        const meta = getCategoryMetadata(category);
        const classes = getColorClasses(meta.bg);
        return (
          <li key={category} className="flex items-center gap-3 py-2">
            <div
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-lg
                ${classes.bg}
              `}
            >
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{category}</span>
                <span className="text-xs text-muted">
                  {active}/{total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div
                  className={`
                    h-full rounded-full transition-all duration-300 ease-out
                    ${classes.bg}
                  `}
                  style={{
                    width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
