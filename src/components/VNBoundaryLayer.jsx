import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function VNBoundaryLayer({ opacity = 1.0 }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // WMS Layer cho ranh giới hành chính Việt Nam từ PopGIS
    const boundaryLayer = L.tileLayer.wms('https://popgis.vnu.edu.vn/geoserver/wms', {
      layers: 'v_administrative',
      format: 'image/png',
      transparent: true,
      opacity: opacity,
      version: '1.1.1',
      styles: '',
      tiled: true,
      tilesOrigin: '102.10796356201172,8.306297302246094',
      attribution: '&copy; <a href="https://popgis.vnu.edu.vn">PopGIS VNU</a>'
    });

    // Add to map với zIndex cao hơn heatmap
    boundaryLayer.addTo(map);
    boundaryLayer.setZIndex(1000);

    // Cleanup
    return () => {
      if (boundaryLayer && map.hasLayer(boundaryLayer)) {
        map.removeLayer(boundaryLayer);
      }
    };
  }, [map, opacity]);

  return null;
}

