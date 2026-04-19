import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Component hiển thị PM2.5 overlay sử dụng TiTiler backend
 * 
 * @param {Object} props
 * @param {string} props.serverUrl - URL của TiTiler server (mặc định: http://localhost:8000)
 * @param {string} props.selectedDate - Ngày dữ liệu theo định dạng YYYYMMDD (ví dụ: "20251201")
 * @param {number} props.opacity - Độ trong suốt của layer (0-1, mặc định: 0.6)
 * @param {string} props.colormap - Tên colormap (mặc định: "rdylgn_r" cho AQI scale)
 * @param {string} props.rescale - Giá trị min,max cho rescaling (mặc định: "0,150")
 */
export default function PM25TileLayer({ 
  serverUrl = 'http://localhost:8000',
  selectedDate = null,
  opacity = 0.6,
  colormap = 'aqi',  // rdylgn_r: green to red (reversed) - phù hợp với AQI scale
  rescale = '0,150'  // PM2.5 range: 0-150 μg/m³
}) {
  const [tileLayer, setTileLayer] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Xóa layer cũ nếu có
    if (tileLayer && map.hasLayer(tileLayer)) {
      map.removeLayer(tileLayer);
    }

    // Tạo URL cho tiles
    const dateParam = selectedDate ? `&date=${selectedDate}` : '';
    const tileUrl = `${serverUrl}/pm25/tiles/{z}/{x}/{y}.png?colormap_name=${colormap}&rescale=${rescale}${dateParam}`;

    console.log('PM25TileLayer: Creating tile layer with URL:', tileUrl);

    // Tạo tile layer mới
    const newTileLayer = L.tileLayer(tileUrl, {
      opacity: opacity,
      attribution: '&copy; <a href="https://github.com/nvnhat04">SmartAQ Project</a>',
      maxZoom: 18,
      minZoom: 0,
      tileSize: 256,
      crossOrigin: true,
      // Error handling
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    });

    // Add event listeners để debug
    newTileLayer.on('tileerror', (error) => {
      console.error('PM25TileLayer: Tile load error:', error);
    });

    newTileLayer.on('tileload', () => {
      // console.log('PM25TileLayer: Tile loaded successfully');
    });

    // Add layer to map
    newTileLayer.addTo(map);
    setTileLayer(newTileLayer);

    // Cleanup function
    return () => {
      if (newTileLayer && map.hasLayer(newTileLayer)) {
        map.removeLayer(newTileLayer);
      }
    };
  }, [map, serverUrl, selectedDate, opacity, colormap, rescale]);

  return null; // Component không render gì, chỉ add layer vào map
}
