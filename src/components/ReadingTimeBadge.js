import { Clock3 } from "lucide-react";

const ReadingTimeBadge = ({ minutes, compact = false, className = "" }) => (
  <span
    className={`inline-flex shrink-0 items-center rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-blue-800 dark:border-blue-500/20 dark:from-blue-950/50 dark:to-purple-950/40 dark:text-blue-200 ${
      compact
        ? "gap-1 px-1.5 py-0.5 text-[9px]"
        : "gap-1.5 px-2 py-1 text-[10px] sm:text-[11px]"
    } ${className}`}
  >
    <Clock3 className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
    {minutes || 1} min read
  </span>
);

export default ReadingTimeBadge;
