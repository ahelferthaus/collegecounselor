import { useMemo, useState } from 'react';
import { MapPin, Pencil, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RatingStars } from './RatingStars';
import { QualityBadge } from './QualityBadge';
import {
  type School,
  type Status,
  STATUS_LABELS,
  qualityColor,
} from '@/lib/schools';
import { cn } from '@/lib/utils';

type SortKey = 'ranking' | 'quality' | 'name' | 'recent';

interface SchoolListProps {
  schools: School[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (school: School) => void;
}

const STATUS_STYLES: Record<Status, string> = {
  considering: 'bg-purple-50 text-purple-700',
  visiting: 'bg-amber-50 text-amber-700',
  visited: 'bg-teal-50 text-teal-700',
};

export function SchoolList({
  schools,
  selectedId,
  onSelect,
  onEdit,
}: SchoolListProps) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('ranking');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = schools.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'ranking':
          return b.ranking - a.ranking || a.name.localeCompare(b.name);
        case 'quality':
          return (
            (a.quality ?? 'Z').localeCompare(b.quality ?? 'Z') ||
            a.name.localeCompare(b.name)
          );
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });
    return list;
  }, [schools, query, sort, statusFilter]);

  return (
    <div className="flex h-full flex-col">
      {/* Filter bar */}
      <div className="space-y-2 border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your schools"
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-9 flex-1 text-sm">
              <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ranking">Top ranked</SelectItem>
              <SelectItem value="quality">Best quality</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="recent">Recently added</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as Status | 'all')}
          >
            <SelectTrigger className="h-9 flex-1 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
            <MapPin className="h-8 w-8 text-gray-300" />
            {schools.length === 0
              ? 'No schools yet. Add your first campus to get started.'
              : 'No schools match your filters.'}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((s) => {
              const selected = s.id === selectedId;
              return (
                <li key={s.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(s.id);
                      }
                    }}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 px-3 py-3 transition-colors hover:bg-purple-50/60',
                      selected && 'bg-purple-50',
                    )}
                  >
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: qualityColor(s.quality) }}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-navy-900">
                          {s.name}
                        </p>
                        <QualityBadge quality={s.quality} />
                      </div>
                      {s.location && (
                        <p className="truncate text-xs text-muted-foreground">
                          {s.location}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <RatingStars value={s.ranking} size={13} />
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[11px] font-medium',
                            STATUS_STYLES[s.status],
                          )}
                        >
                          {STATUS_LABELS[s.status]}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Edit ${s.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(s);
                      }}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white hover:text-purple-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
