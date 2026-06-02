import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type School, qualityColor } from '@/lib/schools';

export type MapRegion = 'US' | 'Europe' | 'All';

export interface MapViewHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  showRegion: (region: MapRegion) => void;
}

interface MapViewProps {
  schools: School[];
  selectedId: string | null;
  addMode: boolean;
  onSelect: (id: string) => void;
  onMapClick: (lat: number, lng: number) => void;
}

const REGION_BOUNDS: Record<MapRegion, L.LatLngBoundsExpression> = {
  US: [
    [24, -125],
    [49.5, -66],
  ],
  Europe: [
    [35, -11],
    [60, 30],
  ],
  All: [
    [22, -128],
    [61, 32],
  ],
};

// Build the colored pin as an HTML divIcon: a teardrop with the ranking inside.
function pinIcon(school: School, selected: boolean): L.DivIcon {
  const color = qualityColor(school.quality);
  const rank = school.ranking > 0 ? String(school.ranking) : '';
  const ring = selected
    ? 'box-shadow:0 0 0 4px rgba(127,86,217,0.35);'
    : 'box-shadow:0 1px 4px rgba(0,0,0,0.35);';
  const scale = selected ? 'scale(1.15)' : 'scale(1)';
  const html = `
    <div style="transform:${scale};transition:transform .15s ease;">
      <div style="
        width:30px;height:30px;border-radius:50% 50% 50% 0;
        background:${color};transform:rotate(-45deg);
        border:2px solid #fff;${ring}
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);color:#fff;font-weight:700;
          font-size:13px;font-family:Inter,sans-serif;line-height:1;">${rank}</span>
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: 'cc-pin',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

export const MapView = forwardRef<MapViewHandle, MapViewProps>(
  function MapView({ schools, selectedId, addMode, onSelect, onMapClick }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    // Keep latest callbacks/state in refs so the init effect can stay run-once.
    const onSelectRef = useRef(onSelect);
    const onMapClickRef = useRef(onMapClick);
    const addModeRef = useRef(addMode);
    useEffect(() => {
      onSelectRef.current = onSelect;
      onMapClickRef.current = onMapClick;
      addModeRef.current = addMode;
    });

    // Initialize the map once.
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [44, -40],
        zoom: 3,
        worldCopyJump: true,
        zoomControl: true,
      });
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (addModeRef.current) {
          onMapClickRef.current(e.latlng.lat, e.latlng.lng);
        }
      });

      map.fitBounds(REGION_BOUNDS.All, { padding: [20, 20] });
      mapRef.current = map;

      const markers = markersRef.current;
      return () => {
        map.remove();
        mapRef.current = null;
        markers.clear();
      };
    }, []);

    // Reflect add-mode in the cursor.
    useEffect(() => {
      const el = containerRef.current;
      if (el) el.style.cursor = addMode ? 'crosshair' : '';
    }, [addMode]);

    // Sync markers with the schools list (and selection styling).
    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;
      const markers = markersRef.current;
      const seen = new Set<string>();

      for (const school of schools) {
        seen.add(school.id);
        const selected = school.id === selectedId;
        let marker = markers.get(school.id);
        if (!marker) {
          marker = L.marker([school.lat, school.lng], {
            icon: pinIcon(school, selected),
          });
          marker.on('click', () => onSelectRef.current(school.id));
          marker.addTo(map);
          markers.set(school.id, marker);
        } else {
          marker.setLatLng([school.lat, school.lng]);
          marker.setIcon(pinIcon(school, selected));
        }
        marker.bindTooltip(school.name, {
          direction: 'top',
          offset: [0, -28],
          opacity: 0.95,
        });
      }

      // Remove markers for deleted schools.
      for (const [id, marker] of markers) {
        if (!seen.has(id)) {
          map.removeLayer(marker);
          markers.delete(id);
        }
      }
    }, [schools, selectedId]);

    useImperativeHandle(ref, () => ({
      flyTo: (lat, lng, zoom = 10) => {
        mapRef.current?.flyTo([lat, lng], zoom, { duration: 0.8 });
      },
      showRegion: (region) => {
        mapRef.current?.fitBounds(REGION_BOUNDS[region], { padding: [20, 20] });
      },
    }));

    return <div ref={containerRef} className="h-full w-full" />;
  },
);
