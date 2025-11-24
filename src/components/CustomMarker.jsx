import L from 'leaflet';
import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#7f1d1d';
};

function CustomMarker({ position, aqi, name, status, onMarkerClick }) {
  const map = useMap();
  const color = getAQIColor(aqi);

  // Create custom icon
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative group">
        ${aqi > 150 ? '<div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>' : ''}
        <div class="relative w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500" style="background-color: ${color};">
          ${aqi}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker 
      position={position} 
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onMarkerClick) {
            onMarkerClick({ lat: position[0], lng: position[1], aqi, name, status });
          }
          map.setView(position, 12, { animate: true });
        }
      }}
    >
      <Popup>
        <div className="text-center">
          <div className="font-bold text-gray-800">{name}</div>
          <div className="text-sm" style={{ color }}>AQI: {aqi}</div>
          <div className="text-xs text-gray-500">{status}</div>
        </div>
      </Popup>
    </Marker>
  );
}

export default CustomMarker;