import catHome from "@/assets/categoryIcons/category-home.webp";
import catHealth from "@/assets/categoryIcons/category-health.webp";
import catCareer from "@/assets/categoryIcons/category-career.webp";
import catErrands from "@/assets/categoryIcons/category-errands.webp";
import catFamily from "@/assets/categoryIcons/category-family.webp";
import catFinance from "@/assets/categoryIcons/category-finance.webp";
import type { TaskCategory } from "@/features/tasks/types/types";

export const taskCategories = [
  "Home & Household",
  "Health & Wellness",
  "Career Development",
  "Errands & Life Admin",
  "Family & Relationships",
  "Finances",
] as const satisfies readonly TaskCategory[];

export const categoryMetadata = {
  "Home & Household": { bg: "primary", text: "primary", icon: catHome },
  "Health & Wellness": { bg: "error", text: "error", icon: catHealth },
  "Career Development": { bg: "warning", text: "warning", icon: catCareer },
  "Errands & Life Admin": { bg: "info", text: "info", icon: catErrands },
  "Family & Relationships": { bg: "accent", text: "accent", icon: catFamily },
  Finances: { bg: "secondary", text: "secondary", icon: catFinance },
  Other: { bg: "muted", text: "muted", icon: catErrands },
} as const;
