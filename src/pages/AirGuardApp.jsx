import L from 'leaflet';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Droplets,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Minus,
  Newspaper,
  Plus,
  Search,
  Shield,
  Thermometer,
  Wind,
  X
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis
} from 'recharts';
import HeatmapOverlay from '../components/HeatmapOverlay';
import AIChat from './AIchat';
import AnalyticsView from './Analytics';
import NewsView from './News';

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// --- MOCK DATA ---
const forecastDays = [
  { id: 0, label: 'Hôm nay', date: '19/11' },
  { id: 1, label: 'Ngày mai', date: '20/11' },
  { id: 2, label: 'Thứ 5', date: '21/11' },
  { id: 3, label: 'Thứ 6', date: '22/11' },
  { id: 4, label: 'Thứ 7', date: '23/11' },
  { id: 5, label: 'Chủ nhật', date: '24/11' },
  { id: 6, label: 'Thứ 2', date: '25/11' },
];
const baseStationMarkers = [
  { 
    id: 1, 
    lat: 21.028511, 
    lng: 105.804817, 
    baseAqi: 141, 
    name: 'Trạm Cầu Giấy',
    address: 'Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    district: 'Quận Cầu Giấy',
    city: 'Hà Nội'
  },
  { 
    id: 2, 
    lat: 20.980549, 
    lng: 105.777182, 
    baseAqi: 91, 
    name: 'Trạm Hà Đông',
    address: 'Phường Quang Trung, Quận Hà Đông, Hà Nội',
    district: 'Quận Hà Đông',
    city: 'Hà Nội'
  },
  { 
    id: 3, 
    lat: 20.999001, 
    lng: 105.801448, 
    baseAqi: 81, 
    name: 'Trạm Thanh Xuân',
    address: 'Phường Nhân Chính, Quận Thanh Xuân, Hà Nội',
    district: 'Quận Thanh Xuân',
    city: 'Hà Nội'
  },
  { 
    id: 4, 
    lat: 21.121444, 
    lng: 106.111273, 
    baseAqi: 87, 
    name: 'Trạm Bắc Ninh',
    address: 'Phường Suối Hoa, Thành phố Bắc Ninh, Bắc Ninh',
    district: 'Thành phố Bắc Ninh',
    city: 'Bắc Ninh'
  },
  { 
    id: 5, 
    lat: 21.039937, 
    lng: 105.921001, 
    baseAqi: 49, 
    name: 'Trạm Gia Lâm',
    address: 'Phường Yên Thường, Quận Gia Lâm, Hà Nội',
    district: 'Quận Gia Lâm',
    city: 'Hà Nội'
  },
  { 
    id: 6, 
    lat: 20.946839, 
    lng: 105.952934, 
    baseAqi: 40, 
    name: 'Trạm Ecopark',
    address: 'Xã Xuân Quan, Huyện Văn Giang, Hưng Yên',
    district: 'Huyện Văn Giang',
    city: 'Hưng Yên'
  },
  { 
    id: 7, 
    lat: 21.323284, 
    lng: 105.429681, 
    baseAqi: 108, 
    name: 'Trạm Việt Trì',
    address: 'Phường Tân Dân, Thành phố Việt Trì, Phú Thọ',
    district: 'Thành phố Việt Trì',
    city: 'Phú Thọ'
  },
  { 
    id: 8, 
    lat: 21.275277, 
    lng: 106.449584, 
    baseAqi: 88, 
    name: 'Trạm Lục Ngạn',
    address: 'Thị trấn Chũ, Huyện Lục Ngạn, Bắc Giang',
    district: 'Huyện Lục Ngạn',
    city: 'Bắc Giang'
  },
  { 
    id: 9, 
    lat: 21.141819, 
    lng: 106.384886, 
    baseAqi: 101, 
    name: 'Trạm Chí Linh',
    address: 'Phường Sao Đỏ, Thành phố Chí Linh, Hải Dương',
    district: 'Thành phố Chí Linh',
    city: 'Hải Dương'
  },
];
const healthAdvice = {
  good: { text: "Không khí tuyệt vời! Hãy tận hưởng các hoạt động ngoài trời.", icon: "😊", action: "Mở cửa sổ" },
  moderate: { text: "Chất lượng chấp nhận được. Nhóm nhạy cảm nên hạn chế vận động mạnh.", icon: "😐", action: "Theo dõi thêm" },
  unhealthy: { text: "Có hại cho sức khỏe. Nên đeo khẩu trang khi ra đường.", icon: "😷", action: "Đeo khẩu trang" },
  veryUnhealthy: { text: "Rất có hại. Hạn chế tối đa ra ngoài. Đóng kín cửa sổ.", icon: "🤢", action: "Đóng cửa sổ" },
  hazardous: { text: "Nguy hại! Ở trong nhà và sử dụng máy lọc không khí ngay.", icon: "☠️", action: "Dùng máy lọc khí" }
};

// Hàm sinh dữ liệu chi tiết giả lập cho từng marker
const generateLocationDetails = (baseData) => {
  const aqi = baseData.aqi;
  let status = 'Tốt';
  let color = '#22c55e'; // Green
  let advice = healthAdvice.good;

  if (aqi > 50) { status = 'Trung bình'; color = '#eab308'; advice = healthAdvice.moderate; }
  if (aqi > 100) { status = 'Kém'; color = '#f97316'; advice = healthAdvice.unhealthy; }
  if (aqi > 150) { status = 'Xấu'; color = '#ef4444'; advice = healthAdvice.veryUnhealthy; }
  if (aqi > 200) { status = 'Nguy hại'; color = '#7f1d1d'; advice = healthAdvice.hazardous; }

  return {
    ...baseData,
    status,
    color,
    advice,
    temp: 28 + Math.floor(Math.random() * 5), // 28-32 do C
    humidity: 60 + Math.floor(Math.random() * 20), // 60-80%
    wind: (Math.random() * 10).toFixed(1), // km/h
    pm25: (aqi * 0.6).toFixed(1),
    pm10: (aqi * 1.1).toFixed(1),
    co: (Math.random() * 1000).toFixed(0),
    no2: (Math.random() * 40).toFixed(1),
    so2: (Math.random() * 20).toFixed(1),
    o3: (Math.random() * 60).toFixed(1),
    uv: Math.floor(Math.random() * 10)
  };
};
const getStatusColor = (aqi) => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  return 'bg-purple-900';
};
const stationMarkers = [
  { id: 1, x: 200, y: 350, aqi: 141, name: 'Cầu Giấy' },
  { id: 2, x: 170, y: 400, aqi: 91, name: 'Hà Đông' },
  { id: 3, x: 190, y: 400, aqi: 81, name: 'Thanh Xuân' },
  { id: 4, x: 260, y: 300, aqi: 87, name: 'Bắc Ninh' },
  { id: 5, x: 240, y: 320, aqi: 49, name: 'Gia Lâm' },
  { id: 6, x: 260, y: 380, aqi: 40, name: 'Ecopark' },
  { id: 7, x: 90, y: 150, aqi: 108, name: 'Phú Thọ' },
  { id: 8, x: 330, y: 200, aqi: 88, name: 'Bắc Giang' },
  { id: 9, x: 360, y: 450, aqi: 101, name: 'Hải Dương' },
].map(generateLocationDetails); // Hydrate data

const mapLabels = [
  { text: "Hà Nội", x: 180, y: 280 },
  { text: "Hưng Yên", x: 280, y: 550 },
  { text: "Bắc Ninh", x: 270, y: 280 },
  { text: "Vĩnh Phúc", x: 150, y: 150 },
];
// Dữ liệu dự báo các ngày

// Dữ liệu biểu đồ nhỏ
const weeklyData = [
  { time: 'Mon', val: 150 }, { time: 'Tue', val: 85 }, { time: 'Wed', val: 120 }, 
  { time: 'Thu', val: 90 }, { time: 'Fri', val: 70 }, { time: 'Sat', val: 40 }
];


// --- UTILS ---
const getGridColor = (row, col) => {
  const dist = Math.sqrt(Math.pow(row - 10, 2) + Math.pow(col - 10, 2));
  if (dist < 4) return '#f97316'; 
  if (dist < 7) return '#eab308'; 
  if (dist < 12 && Math.random() > 0.7) return '#eab308'; 
  return '#22c55e'; 
};

const AQIBar = ({ className = "" }) => {
  const colors = [
    "#22c55e", // Tốt
    "#eab308", // Trung bình
    "#f97316", // Kém
    "#ef4444", // Xấu
    "#7c3aed", // Rất xấu
    "#7f1d1d", // Nguy hiểm
  ];

  const ranges = [
    "0–50",
    "51–100",
    "101–150",
    "151–200",
    "201–300",
    "300+"
  ];

  return (
    <div className={`flex flex-row items-stretch h-6 ${className} overflow-hidden rounded-lg`}>
      {colors.map((c, i) => (
        <div key={i} className="flex-1 relative" style={{ backgroundColor: c }}>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-[8px] font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {ranges[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};


// 1. Dữ liệu người dùng (Lấy từ GPS & API)
  const userLocation = {
    name: "Hà Nội (Hiện tại)",
    aqi: 158
  };

  
export default function AirGuardApp() {
  const [activeTab, setActiveTab] = useState('map'); 
  const [detailData, setDetailData] = useState(null); // Data for Detail View

  // --- VIEWS ---

  // 1. MAP VIEW WITH OPENSTREETMAP
  const MapView = () => {
    const mapRef = useRef(null);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0); // 0 = Hôm nay
    const [isForecastOpen, setIsForecastOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Enhanced search results with address matching
    const searchResults = searchQuery ? baseStationMarkers.filter(marker => {
      const query = searchQuery.toLowerCase();
      return marker.name.toLowerCase().includes(query) ||
             marker.address.toLowerCase().includes(query) ||
             marker.district.toLowerCase().includes(query) ||
             marker.city.toLowerCase().includes(query);
    }).slice(0, 5) : [];
    
    const handleSearchResultClick = (result) => {
      setSearchQuery('');
      setIsSearchOpen(false);
      if (mapRef.current) {
        mapRef.current.setView([result.lat, result.lng], 12, { animate: true });
      }
    };
    
    // Sinh dữ liệu marker dựa trên ngày được chọn
    const currentMarkers = baseStationMarkers.map(m => {
      let change = (selectedDay * 15) * (m.id % 2 === 0 ? -1 : 1);
      let newAqi = Math.max(20, Math.min(300, m.baseAqi + change));
      return generateLocationDetails({ ...m, aqi: newAqi });
    });

    const handleMarkerClick = (markerData) => {
      const fullData = currentMarkers.find(m => m.id === markerData.id) || markerData;
      setSelectedLoc(fullData);
    };

    const handleZoomIn = () => {
      if (mapRef.current) {
        mapRef.current.zoomIn();
      }
    };

    const handleZoomOut = () => {
      if (mapRef.current) {
        mapRef.current.zoomOut();
      }
    };

    const handleLocateMe = () => {
      // Center on Hanoi
      if (mapRef.current) {
        mapRef.current.setView([21.028511, 105.804817], 11, { animate: true });
      }
    };

    const goToDetail = () => {
      setDetailData(selectedLoc);
      setActiveTab('detail');
    };

    return (
      <div className="h-full relative overflow-hidden select-none font-sans w-full flex flex-col">
          {/* HEADER OVERLAY */}
       <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2 pointer-events-none">

  {/* HÀNG 1: SEARCH + TIME TAB */}
  <div className="flex items-center space-x-2 pointer-events-auto">

    {/* Search Bar */}
    <div className={`flex-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 
        transition-all duration-300 flex items-center px-3 py-2
        ${isSearchOpen ? 'ring-2 ring-blue-500' : ''}`}>

      <Search size={18} className="text-gray-500 mr-2" />
      <input 
        type="text"
        placeholder="Tìm quận, phường, xã..."
        className="bg-transparent outline-none text-sm flex-1 text-gray-800"
        value={searchQuery}
        onFocus={() => setIsSearchOpen(true)}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isSearchOpen && (
        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
          <X size={16} className="text-gray-400" />
        </button>
      )}
    </div>

    {/* Time Tab Button (Forecast chọn ngày) */}
    <button 
      onClick={() => setIsForecastOpen(!isForecastOpen)}
      className={`flex items-center space-x-1 px-3 py-2 rounded-full shadow-lg border transition-all 
        ${isForecastOpen ? 'bg-blue-600 text-white border-blue-600' 
                         : 'bg-white/90 backdrop-blur-md text-gray-700 border-white/50'}`}
    >
      <Calendar size={16} />
      <span className="text-xs font-bold">
        {forecastDays[selectedDay].label} - {forecastDays[selectedDay].date}
      </span>
      <ChevronDown size={14} className={`transition-transform ${isForecastOpen ? 'rotate-180' : ''}`} />
    </button>

  </div>

  {/* Search Results Dropdown */}
  {isSearchOpen && searchQuery && (
    <div className="pointer-events-auto bg-white rounded-2xl shadow-xl border border-gray-100 
        max-h-48 overflow-y-auto p-2 animate-fade-in">
      {searchResults.length > 0 ? (
        searchResults.map(res => (
          <div 
            key={res.id}
            onClick={() => handleSearchResultClick(res)}
            className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center space-x-2"
          >
            <MapPin size={14} className="text-gray-400" />
            <div>
              <div className="text-sm font-bold text-gray-800">{res.name}</div>
              <div className="text-xs text-gray-500">{res.address}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-sm text-gray-400">
          Không tìm thấy địa điểm
        </div>
      )}
    </div>
  )}

  {/* Forecast Dropdown */}
  <div className={`pointer-events-auto overflow-hidden transition-all duration-300 ease-in-out 
      origin-top-right ${isForecastOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
    
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/50 overflow-x-auto no-scrollbar">
      <div className="flex space-x-2 w-max">
        {forecastDays.map(day => (
          <button 
            key={day.id}
            onClick={() => { setSelectedDay(day.id); setIsForecastOpen(false); }}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all 
              ${selectedDay === day.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-white/50 text-gray-600'}`}
          >
            <span className="text-[9px] font-medium opacity-80">{day.date}</span>
            <span className="text-xs font-bold whitespace-nowrap">{day.label}</span>
          </button>
        ))}
      </div>
    </div>

  </div>
</div>



        {/* AQI Legend Bar */}
        <div className="absolute bottom-10 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-lg border border-white/50">
          <div className="flex flex-col gap-1">
            {/* <div className="text-[8px] font-bold text-gray-600 text-center mb-1">Chỉ số AQI</div> */}
            <AQIBar className="w-64" />
          </div>
        </div>

        {/* OpenStreetMap with Heatmap */}
        <div className="flex-1 w-full h-full relative">
          <MapContainer
            center={[21.028511, 105.804817]}
            zoom={10}
            ref={mapRef}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Heatmap Overlay */}
            <HeatmapOverlay selectedDay={selectedDay} />
            
            {/* Custom Markers */}
            {currentMarkers.map((marker) => {
              const getAQIColor = (aqi) => {
                if (aqi <= 50) return '#22c55e';
                if (aqi <= 100) return '#eab308';
                if (aqi <= 150) return '#f97316';
                if (aqi <= 200) return '#ef4444';
                return '#7f1d1d';
              };
              
              const color = getAQIColor(marker.aqi);
              const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `
                  <div class="relative group">
                    ${marker.aqi > 150 ? '<div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>' : ''}
                    <div class="relative w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500" style="background-color: ${color};">
                      ${marker.aqi}
                    </div>
                  </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });
              
              return (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker)
                  }}
                >
                  <Popup>
                    <div className="text-center min-w-[200px]">
                      <div className="font-bold text-gray-800 mb-1">{marker.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{marker.address}</div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-sm font-bold" style={{ color }}>AQI: {marker.aqi}</div>
                        <span className="text-xs text-gray-500">• {marker.status}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-20 right-4 flex flex-col space-y-3 z-[1000]">
          <button onClick={handleZoomIn} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100">
            <Plus size={24} />
          </button>
          <button onClick={handleZoomOut} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100">
            <Minus size={24} />
          </button>
          <button onClick={handleLocateMe} className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all ring-4 ring-blue-200">
            <Crosshair size={24} />
          </button>
        </div>

        {/* Summary Bottom Sheet */}
        {selectedLoc && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-5 z-[1000] animate-slide-up">
             <div className="mb-4">
               <div className="flex items-start justify-between mb-2">
                 <div className="flex-1">
                   <h3 className="text-xl font-bold text-gray-900">{selectedLoc.name}</h3>
                   {selectedLoc.address && (
                     <div className="flex items-start mt-1 text-xs text-gray-500">
                       <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                       <span>{selectedLoc.address}</span>
                     </div>
                   )}
                 </div>
                 <div className="text-right ml-3">
                   <div className="flex items-center text-gray-500 text-sm"><Thermometer size={14} className="mr-1"/> {selectedLoc.temp}°C</div>
                   <div className="flex items-center text-gray-500 text-sm"><Droplets size={14} className="mr-1"/> {selectedLoc.humidity}%</div>
                 </div>
               </div>
               <div className="flex items-center space-x-2 mt-2">
                 <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{backgroundColor: selectedLoc.color}}>AQI {selectedLoc.aqi}</span>
                 <span className="text-sm text-gray-500 font-medium">• {selectedLoc.status}</span>
                 {selectedLoc.district && (
                   <span className="text-xs text-gray-400">• {selectedLoc.district}</span>
                 )}
               </div>
             </div>
             
             <div className="bg-gray-50 p-3 rounded-xl mb-4 flex items-start space-x-3">
                <div className="text-2xl">{selectedLoc.advice.icon}</div>
                <div className="text-sm text-gray-600 leading-tight pt-1">{selectedLoc.advice.text}</div>
             </div>

             <button onClick={goToDetail} className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-transform active:scale-95">
               <span>Xem chi tiết & dự báo</span>
               <ChevronRight size={16} />
             </button>
          </div>
        )}
      </div>
    );
  };

  // 2. DETAIL VIEW REDESIGNED
  const DetailView = () => {
    const data = detailData || stationMarkers[0]; // Fallback
    const forecastData = [
  { day: "Mon", temp: 32, aqi: 90, icon: "☀️" },
  { day: "Tue", temp: 30, aqi: 110, icon: "🌤️" },
  { day: "Wed", temp: 28, aqi: 120, icon: "⛅" },
  { day: "Thur", temp: 32, aqi: 90, icon: "☀️" },
  { day: "Fri", temp: 30, aqi: 60, icon: "🌤️" },
  { day: "Sat", temp: 28, aqi: 40, icon: "⛅" },
  { day: "Sun", temp: 27, aqi: 20, icon: "🌥️" }
];
  const getAQIColor = (score) => {
  if (score <= 50) return "bg-green-100 text-green-800";
  if (score <= 100) return "bg-yellow-100 text-yellow-800";
  if (score <= 150) return "bg-orange-100 text-orange-800";
  if (score <= 200) return "bg-red-100 text-red-800";
  return "bg-purple-100 text-purple-800";
};
    return (
      <div className="h-full bg-gradient-to-b from-gray-50 to-white overflow-y-auto animate-fade-in pb-24 no-scrollbar">
        {/* Header with dynamic color based on AQI */}
        <div className="relative pt-12 pb-12 px-4 rounded-b-[45px] shadow-2xl text-white transition-all duration-500" style={{ background: `linear-gradient(135deg, ${data.color} 0%, ${data.color}dd 100%)` }}>
          <button onClick={() => setActiveTab('map')} className="absolute top-6 left-6 p-2.5 bg-white/25 backdrop-blur-md rounded-xl hover:bg-white/35 transition-all duration-300 shadow-lg hover:scale-105">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <div className="text-center mt-4 flex flex-col items-center">
            <div className="flex justify-center items-center space-x-2 text-sm mb-3 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
              <MapPin size={16} className="animate-pulse" /> 
              <span className="font-semibold">{data.name}</span>
            </div>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
              <h1 className="relative text-6xl font-black mb-3 tracking-tight drop-shadow-lg">{data.aqi}</h1>
            </div>
            <div className="inline-block px-4 py-2 rounded-2xl bg-white/25 backdrop-blur-md text-base font-bold border-2 border-white/40 shadow-lg">
              {data.status}
            </div>
            <div className="mt-5 flex justify-center items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <div className="text-xs opacity-75">PM2.5</div>
                <div className="text-lg font-bold">{data.pm25} µg/m³</div>
              </div>
            </div>
            <div className="mt-4 text-sm opacity-95 font-medium max-w-[85%] mx-auto leading-relaxed bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
              💡 {data.advice.text}
            </div>
          </div>
        </div>

        <div className="pt-20 px-5 -mt-10 space-y-5">
          {/* Main Weather Grid */}
          <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-gray-100 grid grid-cols-3 gap-5 text-center">
            <div className="flex flex-col items-center space-y-2">
               <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-2xl">
                 <Thermometer size={24} className="text-orange-600" />
               </div>
               <span className="text-2xl font-black text-gray-800">{data.temp}°</span>
               <span className="text-xs text-gray-500 font-semibold">Nhiệt độ</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
               <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-2xl">
                 <Droplets size={24} className="text-blue-600" />
               </div>
               <span className="text-2xl font-black text-gray-800">{data.humidity}%</span>
               <span className="text-xs text-gray-500 font-semibold">Độ ẩm</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
               <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-3 rounded-2xl">
                 <Wind size={24} className="text-gray-600" />
               </div>
               <span className="text-2xl font-black text-gray-800">{data.wind}</span>
               <span className="text-xs text-gray-500 font-semibold">Gió km/h</span>
            </div>
          </div>

          {/* Health Recommendation */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-xl border-2 border-green-100">
             <div className="flex items-center space-x-3 mb-4">
               <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-md">
                 <Shield size={20} className="text-white"/>
               </div>
               <h3 className="font-bold text-gray-800 text-lg">Khuyến cáo sức khỏe</h3>
             </div>
             <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-semibold text-gray-700">✅ Hành động nên làm</span>
                     <span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-xl shadow-md">{data.advice.action}</span>
                   </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-orange-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-md shrink-0">
                    <AlertTriangle size={18}/>
                  </div>
                  <div className="text-xs text-gray-700 font-medium leading-relaxed">Nhóm người nhạy cảm (người già, trẻ em) nên hạn chế ra ngoài vào thời điểm này.</div>
                </div>
             </div>
          </div>

          {/* Other Pollutants Grid */}
          {/* <div>
            <h3 className="font-bold text-gray-800 mb-3 ml-1 flex items-center">
               <Activity size={18} className="mr-2 text-purple-600"/> Chỉ số chất ô nhiễm
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <PollutantCard label="PM2.5" value={data.pm25} unit="µg/m³" color="text-red-500" />
              <PollutantCard label="PM10" value={data.pm10} unit="µg/m³" color="text-orange-500" />
              <PollutantCard label="CO" value={data.co} unit="µg/m³" color="text-gray-600" />
              <PollutantCard label="NO₂" value={data.no2} unit="µg/m³" color="text-yellow-600" />
              <PollutantCard label="SO₂" value={data.so2} unit="µg/m³" color="text-blue-600" />
              <PollutantCard label="O₃" value={data.o3} unit="µg/m³" color="text-teal-600" />
            </div>
          </div> */}

          {/* Mini Chart */}
          <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-gray-100 mb-5">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="font-bold text-gray-800 text-base">Diễn biến trong tuần</h3>
            </div>
            <div className="h-36 w-full bg-gradient-to-b from-gray-50 to-white rounded-2xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={data.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={data.color} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af', fontWeight: 600}} />
                  <Area type="monotone" dataKey="val" stroke={data.color} fill="url(#grad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

       <div>
  <div className="flex items-center space-x-3 mb-4">
    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 rounded-xl shadow-md">
      <Calendar size={20} className="text-white"/>
    </div>
    <div>
      <h3 className="font-bold text-gray-800 text-lg">Dự báo 7 ngày</h3>
      <p className="text-xs text-gray-500">Thời tiết & chất lượng không khí</p>
    </div>
  </div>

      {/* Sliding Window */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex space-x-4 w-max">
          {forecastData.map((day, idx) => (
            <div 
              key={idx} 
              className="min-w-[120px] bg-gradient-to-br from-white to-gray-50 rounded-3xl p-5 shadow-lg border-2 border-gray-100 flex flex-col items-center space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <span className="font-bold text-gray-700 text-sm">{day.day}</span>
              <div className="text-4xl drop-shadow-md">{day.icon}</div>
              <span className="font-black text-gray-800 text-xl">{day.temp}°C</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-md ${getAQIColor(day.aqi)}`}>
                {day.aqi} AQI
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

        </div>
      </div>
    );
  };

  const PollutantCard = ({ label, value, unit, color }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
       <div className="text-xs text-gray-400 font-medium">{label}</div>
       <div className="flex items-end space-x-1 mt-1">
         <span className={`text-xl font-bold ${color}`}>{value}</span>
         <span className="text-[10px] text-gray-400 mb-1">{unit}</span>
       </div>
    </div>
  );



  // UI HELPER
  const NavBtn = ({ id, icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${activeTab === id ? 'text-blue-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}>
      {React.cloneElement(icon, { size: activeTab === id ? 24 : 20, strokeWidth: activeTab === id ? 2.5 : 2 })}
      {activeTab === id && <span className="text-[10px] font-bold mt-1 scale-100 origin-bottom animate-fade-in">{label}</span>}
    </button>
  );

  const globalStyles = `
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className="font-sans text-gray-900 bg-gray-200 min-h-screen flex justify-center items-center">
      <style>{globalStyles}</style>
      <div className="w-full max-w-md h-[850px] bg-white shadow-2xl rounded-[3rem] overflow-hidden relative border-8 border-gray-900 flex flex-col">
        <div className="h-8 w-full bg-white z-50 flex justify-between items-center px-6 pt-3 shrink-0">
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex space-x-1"><div className="w-4 h-4 bg-black/20 rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>
        </div>
        
        <div className="flex-1 overflow-hidden relative bg-white">
           {activeTab === 'map' && <MapView />}
           {activeTab === 'detail' && <DetailView />}
           {activeTab === 'analytics' && <AnalyticsView />}
           {activeTab === 'news' && <NewsView />}
           {activeTab === 'ai' && <AIChat />}
      
        </div>

        <div className="h-[80px] bg-white border-t border-gray-100 flex justify-around items-center pb-4 z-50 shrink-0 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <NavBtn id="map" icon={<MapIcon />} label="Dự báo" />
          <NavBtn id="analytics" icon={<BarChart2 />} label="Phơi nhiễm" />
          <NavBtn id="news" icon={<Newspaper />} label="Tin tức" />
          <NavBtn id="ai" icon={<MessageSquare />} label="AI Chat" />
        </div>
      </div>
    </div>
  );
}