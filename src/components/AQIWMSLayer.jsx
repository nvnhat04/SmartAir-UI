import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AQIWMSLayer({ selectedDay = 0, opacity = 1.0 }) {
  const [layerDate, setLayerDate] = useState('');
  const map = useMap();

  useEffect(() => {
    // Tính ngày dựa trên selectedDay
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + selectedDay);
    
    // Format: YYYY-MM-DD
    const dateStr = targetDate.toISOString().split('T')[0];
    setLayerDate(dateStr);
  }, [selectedDay]);

  useEffect(() => {
    if (!map || !layerDate) return;

    // Create WMS layer using Leaflet's L.tileLayer.wms
    const wmsLayer = L.tileLayer.wms('https://popgis.vnu.edu.vn/geoserver/ws_geotiff/wms', {
      layers: 'ws_geotiff:pm25_mem',
      format: 'image/png',
      transparent: true,
      opacity: opacity,
      version: '1.1.1',
      crs: L.CRS.EPSG4326,
      time: layerDate,
      styles: '',
      tiled: true,
      attribution: '&copy; <a href="https://popgis.vnu.edu.vn">PopGIS VNU</a>'
    });

    // Add to map
    wmsLayer.addTo(map);

    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => {
      if (wmsLayer && map.hasLayer(wmsLayer)) {
        map.removeLayer(wmsLayer);
      }
    };
  }, [map, layerDate, opacity]);

  return null; // Component này chỉ add layer vào map, không render gì
}


