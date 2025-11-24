import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import shp from 'shpjs';

export default function VNShapefileLayer() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShapefile();
  }, []);

  const loadShapefile = async () => {
    try {
      setLoading(true);
      
      // Load tất cả các file shapefile
      // shpjs cần: .shp, .shx, .dbf (và tùy chọn .prj)
      const basePath = '/src/assets/VN41HSTS';
      
      // Load các file cần thiết
      const [shpRes, shxRes, dbfRes] = await Promise.all([
        fetch(`${basePath}.shp`),
        fetch(`${basePath}.shx`),
        fetch(`${basePath}.dbf`)
      ]);

      const [shpBuf, shxBuf, dbfBuf] = await Promise.all([
        shpRes.arrayBuffer(),
        shxRes.arrayBuffer(),
        dbfRes.arrayBuffer()
      ]);

      // Combine thành object cho shpjs
      const combined = {
        shp: shpBuf,
        shx: shxBuf,
        dbf: dbfBuf
      };

      // Parse shapefile sang GeoJSON
      const geojson = await shp(combined);
      
      console.log('Shapefile loaded successfully:', geojson);
      setGeoData(geojson);
      setLoading(false);
    } catch (err) {
      console.error('Error loading shapefile:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    console.log('Loading shapefile...');
    return null;
  }

  if (error) {
    console.error('Shapefile error:', error);
    return null;
  }

  if (!geoData) return null;

  // Style cho ranh giới tỉnh
  const boundaryStyle = {
    color: '#374151',        // Màu xám đậm
    weight: 1.5,             // Độ dày đường viền
    opacity: 0.8,
    fillOpacity: 0,          // Không fill màu bên trong
    dashArray: null,         // Đường liền (không dash)
  };

  // Style khi hover và hiển thị tên tỉnh luôn
  const onEachFeature = (feature, layer) => {
    // Hiển thị tên tỉnh luôn trên map (nếu có)
    if (feature.properties && feature.properties.NAME_1) {
      const provinceName = feature.properties.NAME_1;
      
      // Tạo tooltip luôn hiển thị
      layer.bindTooltip(provinceName, {
        permanent: true,           // Luôn hiển thị, không cần hover
        direction: 'center',       // Hiển thị ở giữa polygon
        className: 'province-label-tooltip',
        opacity: 1
      });

      // Popup khi click để xem thêm thông tin
      layer.bindPopup(`
        <div style="font-weight: bold;">
          ${provinceName}
        </div>
      `);
    }

    // Hover effect
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#1f2937',
          opacity: 1
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(boundaryStyle);
      }
    });
  };

  return (
    <GeoJSON
      data={geoData}
      style={boundaryStyle}
      onEachFeature={onEachFeature}
    />
  );
}

