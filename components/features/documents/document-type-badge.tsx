import { cn } from "@/lib/utils";
import type { SwissDocumentType } from "@/lib/ai/ocr/types";

const typeConfig: Record<
  SwissDocumentType,
  { label: string; className: string }
> = {
  tax: {
    label: "Tax",
    className: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  },
  insurance: {
    label: "Insurance",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  permit: {
    label: "Permit",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  municipal: {
    label: "Municipal",
    className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  debt_collection: {
    label: "Debt Collection",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  social_security: {
    label: "Social Security",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  vehicle: {
    label: "Vehicle",
    className: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  },
  customs: {
    label: "Customs",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  utility: {
    label: "Utility",
    className: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  },
  unknown: {
    label: "Unknown",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

export interface DocumentTypeBadgeProps {
  /** Swiss document type */
  type: SwissDocumentType | string | null;
  className?: string;
}

export function DocumentTypeBadge({ type, className }: DocumentTypeBadgeProps) {
  // Handle null or unrecognized types
  const normalizedType = (type && type in typeConfig ? type : "unknown") as SwissDocumentType;
  const config = typeConfig[normalizedType];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
