import { type Quality, QUALITY_COLORS } from '@/lib/schools';
import { cn } from '@/lib/utils';

interface QualityBadgeProps {
  quality: Quality | null;
  className?: string;
}

/** Small A/B/C quality grade chip, colored to match the map pins. */
export function QualityBadge({ quality, className }: QualityBadgeProps) {
  if (!quality) {
    return (
      <span
        className={cn(
          'inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-dashed border-gray-300 px-1.5 text-[11px] font-semibold text-gray-400',
          className,
        )}
      >
        —
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white',
        className,
      )}
      style={{ backgroundColor: QUALITY_COLORS[quality] }}
      title={`Quality grade ${quality}`}
    >
      {quality}
    </span>
  );
}
