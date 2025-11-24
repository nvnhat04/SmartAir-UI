import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

export default function MapLabel({ position, text, className = '' }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !position || !text) return;

    // Create a custom div icon for label
    const labelIcon = L.divIcon({
      className: 'custom-map-label',
      html: `
        <div class="map-label-container ${className}">
          <div class="map-label-text">${text}</div>
        </div>
      `,
      iconSize: [200, 40],
      iconAnchor: [100, 20],
    });

    // Create marker with custom icon (no click interaction)
    const labelMarker = L.marker(position, {
      icon: labelIcon,
      interactive: false, // Không thể click
      keyboard: false,
      zIndexOffset: 1000 // Hiển thị trên cùng
    });

    labelMarker.addTo(map);

    // Cleanup
    return () => {
      if (labelMarker) {
        map.removeLayer(labelMarker);
      }
    };
  }, [map, position, text, className]);

  return null;
}

