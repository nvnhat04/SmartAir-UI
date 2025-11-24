import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Constants for heatmap generation
const GRID_STEP = 0.1; // ~10km grid

const POLLUTION_CENTERS = [
  { lat: 21.028511, lng: 105.804817, radius: 0.5, intensity: 120, name: "Hà Nội" },
  { lat: 20.8449115, lng: 106.6880841, radius: 0.3, intensity: 90, name: "Hải Phòng" },
  { lat: 10.8230989, lng: 106.6297, radius: 0.4, intensity: 150, name: "TP.HCM" },
  { lat: 16.0544068, lng: 108.2021667, radius: 0.25, intensity: 80, name: "Đà Nẵng" },
  { lat: 21.5800, lng: 105.8067, radius: 0.2, intensity: 70, name: "Vĩnh Yên" },
  { lat: 20.9273, lng: 106.8789, radius: 0.2, intensity: 65, name: "Bắc Ninh" },
];

const generateGridHeatmap = () => {
  const points = [];
  // Bounding Box toàn Việt Nam: Lat 8.5 -> 23.5, Lng 102 -> 110
  for (let lat = 8.5; lat <= 23.5; lat += GRID_STEP) {
    for (let lng = 102.0; lng <= 110.0; lng += GRID_STEP) {
      
      // --- LOGIC FILTER HÌNH DÁNG CHỮ S (xấp xỉ) ---
      let insideVietnam = false;
      
      // Khối Miền Bắc (Rộng)
      if (lat >= 20.0 && lat <= 23.5 && lng >= 103.0 && lng <= 108.0) insideVietnam = true;
      // Khối Bắc Trung Bộ (Hẹp ngang)
      else if (lat >= 17.0 && lat < 20.0 && lng >= 105.5 && lng <= 107.0) insideVietnam = true;
      // Khối Nam Trung Bộ (Cong ra biển)
      else if (lat >= 11.0 && lat < 17.0 && lng >= 107.5 && lng <= 109.5) insideVietnam = true;
      // Khối Tây Nguyên (Lồi sang trái)
      else if (lat >= 11.5 && lat < 15.0 && lng >= 107.2 && lng < 108.0) insideVietnam = true;
      // Khối Miền Nam (Rộng)
      else if (lat >= 8.5 && lat < 11.5 && lng >= 104.5 && lng <= 107.5) insideVietnam = true;

      // Tinh chỉnh loại bỏ biển Đông phần xa và biên giới Lào/Cam
      // Cắt chéo biển ở miền Bắc
      if (lat > 20 && lng > 106.5 + (lat - 20) * 0.8) insideVietnam = false;
      // Cắt chéo biên giới phía Tây miền Bắc
      if (lat > 21 && lng < 102.5 + (lat - 21) * 0.5) insideVietnam = false;

      if (!insideVietnam) continue;

      // Tính AQI
      let maxEffect = 0;
      POLLUTION_CENTERS.forEach(center => {
        const dist = Math.sqrt(Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2));
        if (dist < center.radius) {
          const effect = center.intensity * (1 - dist / center.radius);
          maxEffect = Math.max(maxEffect, effect);
        }
      });

      // AQI nền (Xanh)
      const baseAQI = 25 + Math.random() * 10;
      let finalAQI = baseAQI + maxEffect;

      points.push({ lat, lng, aqi: Math.floor(finalAQI) });
    }
  }
  return points;
};

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#7f1d1d';
};

const getAQIOpacity = (aqi) => {
  if (aqi <= 50) return 0.3;
  if (aqi <= 100) return 0.4;
  if (aqi <= 150) return 0.5;
  if (aqi <= 200) return 0.6;
  return 0.7;
};

function HeatmapOverlay({ selectedDay = 0 }) {
  const map = useMap();

  useEffect(() => {
    // Generate heatmap data
    const heatmapData = generateGridHeatmap();

    // Create layer group for heatmap
    const heatmapLayer = L.layerGroup();

    // Add rectangles for each grid point
    heatmapData.forEach(point => {
      // Adjust AQI based on selected day (simulation)
      let adjustedAQI = point.aqi;
      if (selectedDay > 0) {
        adjustedAQI = Math.max(20, Math.min(300, point.aqi + (selectedDay * 10 * (Math.random() > 0.5 ? 1 : -1))));
      }

      const color = getAQIColor(adjustedAQI);
      const opacity = getAQIOpacity(adjustedAQI);

      // Create rectangle for grid cell
      const bounds = [
        [point.lat - GRID_STEP / 2, point.lng - GRID_STEP / 2],
        [point.lat + GRID_STEP / 2, point.lng + GRID_STEP / 2]
      ];

      const rectangle = L.rectangle(bounds, {
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 0,
        interactive: false
      });

      rectangle.addTo(heatmapLayer);
    });

    // Add layer to map
    heatmapLayer.addTo(map);

    // Cleanup on unmount or when selectedDay changes
    return () => {
      map.removeLayer(heatmapLayer);
    };
  }, [map, selectedDay]);

  return null;
}

export default HeatmapOverlay;