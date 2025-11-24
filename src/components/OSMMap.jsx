import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AQIWMSLayer from './AQIWMSLayer';
import VNShapefileLayer from './VNShapefileLayer';
import MapLabel from './MapLabel';

// Fix icon marker mặc định của Leaflet
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component để tự động center map khi user location thay đổi
function MapController({ center, zoom, onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  // Expose map instance to parent
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null;
}

// Custom marker icon cho user location
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3b82f6;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Custom marker icon cho AQI stations
const createAQIIcon = (aqi, color) => {
  return L.divIcon({
    className: 'custom-aqi-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: white;
      ">${aqi}</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function OSMMap({ 
  center = [21.0285, 105.8542], // Hà Nội mặc định
  zoom = 11,
  markers = [],
  userLocation = null,
  onMarkerClick,
  selectedDay = 0,
  onMapReady,
  showHeatmap = true
}) {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const mapRef = useRef(null);

  // Update center khi userLocation prop thay đổi
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(13);
    }
  }, [userLocation]);

  // Update center khi center prop thay đổi
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        key="map-container"
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
        ref={mapRef}
        whenReady={() => {
          // Map ready callback
        }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={1}
        />

        {/* AQI/PM2.5 Heatmap Layer từ PopGIS VNU */}
        {showHeatmap && (
          <AQIWMSLayer 
            selectedDay={selectedDay} 
            opacity={1.0}
          />
        )}

        {/* Ranh giới hành chính Việt Nam từ shapefile (đè lên heatmap) */}
        <VNShapefileLayer />

        {/* Map Controller để tự động center */}
        <MapController center={mapCenter} zoom={mapZoom} onMapReady={onMapReady} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="text-center">
                  <strong>Vị trí của bạn</strong>
                  <br />
                  <span className="text-xs text-gray-500">
                    Lat: {userLocation.lat.toFixed(6)}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Lng: {userLocation.lng.toFixed(6)}
                  </span>
                  {userLocation.accuracy && (
                    <>
                      <br />
                      <span className="text-xs text-blue-600">
                        Độ chính xác: ±{Math.round(userLocation.accuracy)}m
                      </span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* Circle để hiển thị độ chính xác GPS */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy || 100} // Dùng accuracy từ GPS, default 100m
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </>
        )}

        {/* AQI Station Markers */}
        {markers.map((marker) => {
          // Marker phải có lat/lng
          const position = marker.lat && marker.lng 
            ? [marker.lat, marker.lng]
            : null;

          if (!position) return null;

          return (
            <Marker
              key={marker.id}
              position={position}
              icon={createAQIIcon(marker.aqi, marker.color)}
              eventHandlers={{
                click: () => onMarkerClick?.(marker)
              }}
            >
              <Popup>
                <div>
                  <strong>{marker.name}</strong>
                  <br />
                  <span>AQI: {marker.aqi}</span>
                  <br />
                  <span className="text-xs text-gray-500">{marker.status}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Labels cho Hoàng Sa và Trường Sa */}
        <MapLabel 
          position={[16.5, 112.0]} 
          text="Quần đảo Hoàng Sa" 
          className="sovereignty-label"
        />
        <MapLabel 
          position={[10.0, 114.0]} 
          text="Quần đảo Trường Sa" 
          className="sovereignty-label"
        />
      </MapContainer>
    </div>
  );
}

