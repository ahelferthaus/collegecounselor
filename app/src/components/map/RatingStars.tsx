import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}

/**
 * 1-5 star rating. Read-only when `onChange` is omitted, interactive otherwise.
 * Tapping the currently-selected star clears the rating back to 0.
 */
export function RatingStars({
  value,
  onChange,
  size = 18,
  className,
}: RatingStarsProps) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === 'function';
  const display = hover || value;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label="Ranking out of 5"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        const StarEl = (
          <Star
            width={size}
            height={size}
            className={cn(
              'transition-colors',
              filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-gray-300',
            )}
          />
        );
        if (!interactive) return <span key={n}>{StarEl}</span>;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className="rounded-sm p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(value === n ? 0 : n)}
          >
            {StarEl}
          </button>
        );
      })}
    </div>
  );
}
