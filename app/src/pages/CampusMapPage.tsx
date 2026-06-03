import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  List,
  MapPinPlus,
  MoreVertical,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapView, type MapRegion, type MapViewHandle } from '@/components/map/MapView';
import { SchoolList } from '@/components/map/SchoolList';
import { SchoolForm, type FormSeed } from '@/components/map/SchoolForm';
import { SyncMenu } from '@/components/map/SyncMenu';
import { useSchools, type NewSchool } from '@/hooks/useSchools';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { type School, QUALITY_COLORS } from '@/lib/schools';
import { cn } from '@/lib/utils';

const REGIONS: MapRegion[] = ['US', 'Europe', 'All'];

export function CampusMapPage() {
  const { userId, email, signInWithEmail, signOut } = useAuth();
  const {
    schools,
    status,
    addSchool,
    updateSchool,
    removeSchool,
    clearAll,
    importSchools,
  } = useSchools(userId);

  const mapRef = useRef<MapViewHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState<MapRegion>('All');
  const [addMode, setAddMode] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formSeed, setFormSeed] = useState<FormSeed | null>(null);

  function focusSchool(id: string) {
    const s = schools.find((x) => x.id === id);
    if (!s) return;
    setSelectedId(id);
    mapRef.current?.flyTo(s.lat, s.lng, 9);
  }

  function handleSelectFromList(id: string) {
    focusSchool(id);
    setMobileListOpen(false);
  }

  function openAddForm() {
    setFormSeed(null);
    setFormOpen(true);
  }

  function openEditForm(school: School) {
    setFormSeed({ school });
    setFormOpen(true);
    setMobileListOpen(false);
  }

  function handleRegion(r: MapRegion) {
    setRegion(r);
    mapRef.current?.showRegion(r);
  }

  function handleMapClick(lat: number, lng: number) {
    setAddMode(false);
    setFormSeed({ lat, lng });
    setFormOpen(true);
  }

  async function handleSubmit(data: NewSchool) {
    try {
      if (formSeed?.school) {
        await updateSchool(formSeed.school.id, data);
        toast.success('School updated');
        focusSchool(formSeed.school.id);
      } else {
        const created = await addSchool(data);
        toast.success('School added');
        setSelectedId(created.id);
        mapRef.current?.flyTo(created.lat, created.lng, 9);
      }
    } catch {
      toast.error('Could not save — your changes are kept locally.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeSchool(id);
      if (selectedId === id) setSelectedId(null);
      toast.success('School removed');
    } catch {
      toast.error('Could not remove that school.');
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(schools, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-map-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported your schools');
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('bad format');
        await importSchools(parsed as School[]);
        toast.success(`Imported ${parsed.length} schools`);
      } catch {
        toast.error('Could not read that file');
      }
    };
    reader.readAsText(file);
  }

  async function handleClearAll() {
    if (
      window.confirm(
        'Remove all tagged schools? This clears your saved map and cannot be undone.',
      )
    ) {
      await clearAll();
      setSelectedId(null);
      toast.success('Cleared your map');
    }
  }

  const overflowMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="More options">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" /> Import (JSON)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleClearAll}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      {/* Header */}
      <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 transition-colors hover:bg-gray-100"
            aria-label="Back to College Counselor"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-base font-bold leading-tight text-navy-900">
              Campus Map
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {schools.length} school{schools.length === 1 ? '' : 's'} tagged
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SyncMenu
            configured={isSupabaseConfigured}
            email={email}
            status={status}
            onSignIn={signInWithEmail}
            onSignOut={signOut}
          />
          <Button
            onClick={openAddForm}
            className="hidden bg-gradient-purple-teal text-white hover:opacity-90 sm:inline-flex"
          >
            <Plus className="mr-1 h-4 w-4" /> Add school
          </Button>
          {overflowMenu}
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-96 shrink-0 flex-col border-r border-border lg:flex">
          <SchoolList
            schools={schools}
            selectedId={selectedId}
            onSelect={focusSchool}
            onEdit={openEditForm}
          />
        </aside>

        {/* Map */}
        <main className="relative min-w-0 flex-1">
          <MapView
            ref={mapRef}
            schools={schools}
            selectedId={selectedId}
            addMode={addMode}
            onSelect={focusSchool}
            onMapClick={handleMapClick}
          />

          {/* Region segmented control */}
          <div className="pointer-events-auto absolute left-1/2 top-3 z-[1000] -translate-x-1/2">
            <div className="flex rounded-full bg-white/90 p-1 shadow-md backdrop-blur">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRegion(r)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold transition-colors sm:text-sm',
                    region === r
                      ? 'bg-gradient-purple-teal text-white'
                      : 'text-navy-700 hover:bg-gray-100',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Pin-on-map toggle */}
          <button
            onClick={() => setAddMode((v) => !v)}
            className={cn(
              'absolute right-3 top-3 z-[1000] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold shadow-md backdrop-blur transition-colors',
              addMode
                ? 'bg-purple-600 text-white'
                : 'bg-white/90 text-navy-700 hover:bg-gray-100',
            )}
          >
            <MapPinPlus className="h-4 w-4" />
            <span className="hidden sm:inline">
              {addMode ? 'Tap the map…' : 'Drop a pin'}
            </span>
          </button>

          {/* Legend */}
          <div className="absolute bottom-4 left-3 z-[1000] hidden rounded-xl bg-white/90 p-3 text-xs shadow-md backdrop-blur sm:block">
            <p className="mb-1.5 font-semibold text-navy-900">Quality</p>
            <div className="space-y-1">
              {(['A', 'B', 'C'] as const).map((q) => (
                <div key={q} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: QUALITY_COLORS[q] }}
                  />
                  <span className="text-muted-foreground">
                    {q === 'A' ? 'A · Top' : q === 'B' ? 'B · Solid' : 'C · Backup'}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-600" />
                <span className="text-muted-foreground">Ungraded</span>
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">Number = ranking (1–5)</p>
          </div>

          {/* Mobile floating actions */}
          <div className="absolute bottom-5 right-4 z-[1000] flex flex-col gap-3 lg:hidden">
            <Button
              size="icon-lg"
              variant="outline"
              className="rounded-full bg-white shadow-lg"
              onClick={() => setMobileListOpen(true)}
              aria-label="Open school list"
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              size="icon-lg"
              className="rounded-full bg-gradient-purple-teal text-white shadow-lg hover:opacity-90"
              onClick={openAddForm}
              aria-label="Add school"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </main>
      </div>

      {/* Mobile list drawer */}
      <Drawer open={mobileListOpen} onOpenChange={setMobileListOpen}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="font-heading">
              Your schools ({schools.length})
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-hidden">
            <SchoolList
              schools={schools}
              selectedId={selectedId}
              onSelect={handleSelectFromList}
              onEdit={openEditForm}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <SchoolForm
        open={formOpen}
        onOpenChange={setFormOpen}
        seed={formSeed}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}
