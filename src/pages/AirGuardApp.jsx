import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, BarChart2, MessageSquare, Info, 
  Compass, X, Send, ChevronUp, ChevronRight, MapPin,
  Newspaper, Clock, TrendingUp, AlertTriangle, Cigarette, 
  Share2, ArrowRight, Wind, Droplets, Thermometer, 
  Plus, Minus, Crosshair, Activity, Shield, ArrowLeft,
  Trophy, Medal, ArrowDown, ArrowUp, Calendar, AirVent, Filter, ChevronDown, Search,  MapPinned, History
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ReferenceLine, Cell
} from 'recharts';
import NewsView from './News';
import AnalyticsView from './Analytics';
import AIChat from './AIchat';
import OSMMap from '../components/OSMMap';

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
  { id: 1, x: 200, y: 350, baseAqi: 141, name: 'Cầu Giấy', lat: 21.0367, lng: 105.8014 },
  { id: 2, x: 170, y: 400, baseAqi: 91, name: 'Hà Đông', lat: 21.0056, lng: 105.7639 },
  { id: 3, x: 190, y: 400, baseAqi: 81, name: 'Thanh Xuân', lat: 21.0014, lng: 105.8081 },
  { id: 4, x: 260, y: 300, baseAqi: 87, name: 'Bắc Ninh', lat: 21.1864, lng: 106.0763 },
  { id: 5, x: 240, y: 320, baseAqi: 49, name: 'Gia Lâm', lat: 21.0233, lng: 105.9389 },
  { id: 6, x: 260, y: 380, baseAqi: 40, name: 'Ecopark', lat: 20.9167, lng: 106.0167 },
  { id: 7, x: 90, y: 150, baseAqi: 108, name: 'Phú Thọ', lat: 21.3228, lng: 105.4019 },
  { id: 8, x: 330, y: 200, baseAqi: 88, name: 'Bắc Giang', lat: 21.2731, lng: 106.1946 },
  { id: 9, x: 360, y: 450, baseAqi: 101, name: 'Hải Dương', lat: 20.9373, lng: 106.3146 },
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
const hourlyData = [
  { time: '6h', val: 40 }, { time: '9h', val: 85 }, { time: '12h', val: 120 }, 
  { time: '15h', val: 90 }, { time: '18h', val: 110 }, { time: '21h', val: 60 }
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
    <div className={`flex flex-row items-center h-5 ${className || 'w-full'} space-x-[1px]`}>
      {colors.map((c, i) => (
        <div key={i} className="flex-1 relative h-full">
          <div
            className="h-full w-full rounded-sm"
            style={{ backgroundColor: c }}
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-[7px] font-bold text-white drop-shadow">
              {ranges[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};



export default function AirGuardApp() {
  const [activeTab, setActiveTab] = useState('map'); 
  const [detailData, setDetailData] = useState(null); // Data for Detail View

  // --- VIEWS ---

  // 1. MAP VIEW với OpenStreetMap
  const MapView = () => {
    // State cho GPS location
    const [userLocation, setUserLocation] = useState(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    
    // Các state cũ
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [isForecastOpen, setIsForecastOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Ref cho Leaflet map instance
    const [mapInstance, setMapInstance] = useState(null);
    
    // Sinh dữ liệu marker dựa trên ngày được chọn
    const currentMarkers = baseStationMarkers.map(m => {
      let change = (selectedDay * 15) * (m.id % 2 === 0 ? -1 : 1);
      let newAqi = Math.max(20, Math.min(300, m.baseAqi + change));
      return generateLocationDetails({ ...m, aqi: newAqi });
    });

    // GPS Location Handler - Improved
    const handleLocateMe = () => {
      if (!navigator.geolocation) {
        setGpsError('Trình duyệt không hỗ trợ GPS');
        return;
      }

      setGpsLoading(true);
      setGpsError(null);

      // Try high accuracy first
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`GPS Position: ${latitude}, ${longitude}, Accuracy: ${accuracy}m`);
          
          setUserLocation({ 
            lat: latitude, 
            lng: longitude,
            accuracy: accuracy 
          });
          setGpsLoading(false);
        },
        (error) => {
          console.error('GPS Error:', error);
          let errorMsg = 'Không thể lấy vị trí GPS';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật Location trong Settings';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Thông tin vị trí không khả dụng. Hãy thử lại';
              break;
            case error.TIMEOUT:
              errorMsg = 'Hết thời gian chờ. Đang thử lại với độ chính xác thấp hơn...';
              // Fallback: Try with lower accuracy
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude, accuracy } = position.coords;
                  setUserLocation({ lat: latitude, lng: longitude, accuracy });
                  setGpsLoading(false);
                },
                () => {
                  setGpsError('Không thể lấy vị trí. Vui lòng kiểm tra GPS/Location');
                  setGpsLoading(false);
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
              );
              return;
          }
          
          setGpsError(errorMsg);
          setGpsLoading(false);
        },
        options
      );
    };

    // Search functionality
    const searchLocations = [
      { id: 1, name: 'Cầu Giấy', address: 'Quận Cầu Giấy, Hà Nội', lat: 21.0367, lng: 105.8014 },
      { id: 2, name: 'Hà Đông', address: 'Quận Hà Đông, Hà Nội', lat: 21.0056, lng: 105.7639 },
      { id: 3, name: 'Thanh Xuân', address: 'Quận Thanh Xuân, Hà Nội', lat: 21.0014, lng: 105.8081 },
      { id: 4, name: 'Bắc Ninh', address: 'Tỉnh Bắc Ninh', lat: 21.1864, lng: 106.0763 },
      { id: 5, name: 'Gia Lâm', address: 'Huyện Gia Lâm, Hà Nội', lat: 21.0233, lng: 105.9389 },
      { id: 6, name: 'Ecopark', address: 'Hưng Yên', lat: 20.9167, lng: 106.0167 },
      { id: 7, name: 'Phú Thọ', address: 'Tỉnh Phú Thọ', lat: 21.3228, lng: 105.4019 },
      { id: 8, name: 'Bắc Giang', address: 'Tỉnh Bắc Giang', lat: 21.2731, lng: 106.1946 },
      { id: 9, name: 'Hải Dương', address: 'Tỉnh Hải Dương', lat: 20.9373, lng: 106.3146 },
    ];

    const searchResults = searchQuery
      ? searchLocations.filter(loc => 
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

    const handleSearchResultClick = (result) => {
      setUserLocation({ lat: result.lat, lng: result.lng });
      setIsSearchOpen(false);
      setSearchQuery('');
    };

    const goToDetail = () => {
      setDetailData(selectedLoc);
      setActiveTab('detail');
    };

    // Zoom controls
    const handleZoomIn = () => {
      if (mapInstance) {
        mapInstance.zoomIn();
      }
    };

    const handleZoomOut = () => {
      if (mapInstance) {
        mapInstance.zoomOut();
      }
    };

    return (
      <div className="h-full relative bg-gray-100 overflow-hidden select-none font-sans w-full flex flex-col">
          {/* HEADER OVERLAY */}
       <div className="absolute top-4 left-4 right-4 z-30 flex flex-col space-y-2 pointer-events-none">

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



       {/* AQI Bar Legend */}
       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 bg-white/80 backdrop-blur rounded-xl p-2 shadow-md border border-white/50">
         <AQIBar className="w-[280px]" />
       </div>

        {/* Map Canvas - OpenStreetMap */}
        <div className="flex-1 w-full h-full relative">
          <OSMMap
            center={userLocation ? [userLocation.lat, userLocation.lng] : [21.0285, 105.8542]}
            zoom={userLocation ? 13 : 11}
            markers={currentMarkers}
            userLocation={userLocation}
            onMarkerClick={(marker) => {
              setSelectedLoc(marker);
            }}
            selectedDay={selectedDay}
            onMapReady={(map) => setMapInstance(map)}
            showHeatmap={true}
          />
        </div>

        {/* Floating Controls */}
        <div className="absolute top-20 right-4 flex flex-col space-y-3 z-20">
          <button 
            onClick={handleZoomIn}
            className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
          >
            <Plus size={24} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
          >
            <Minus size={24} />
          </button>
          <button 
            onClick={handleLocateMe} 
            disabled={gpsLoading}
            className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all border border-gray-100
              ${gpsLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 ring-4 ring-blue-200'}`}
          >
            {gpsLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Crosshair size={24} />
            )}
          </button>
        </div>

        {/* GPS Error Toast */}
        {gpsError && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] 
            bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm shadow-lg animate-fade-in">
            {gpsError}
            <button 
              onClick={() => setGpsError(null)}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Summary Bottom Sheet */}
        {selectedLoc && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-30 animate-slide-up">
             {/* Drag indicator bar */}
             <div className="flex justify-center pt-3 pb-2">
               <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
             </div>
             
             {/* Header với nút back */}
             <div className="flex items-center justify-between px-5 pb-2">
               <button 
                 onClick={() => setSelectedLoc(null)}
                 className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                 title="Đóng"
               >
                 <X size={20} className="text-gray-600" />
               </button>
               <div className="text-xs text-gray-400 font-medium">Thông tin trạm đo</div>
               <div className="w-8"></div> {/* Spacer cho symmetry */}
             </div>
             
             {/* Content */}
             <div className="px-5 pb-5">
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900">{selectedLoc.name}</h3>
                   <div className="flex items-center space-x-2 mt-1">
                     <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{backgroundColor: selectedLoc.color}}>AQI {selectedLoc.aqi}</span>
                     <span className="text-sm text-gray-500 font-medium">• {selectedLoc.status}</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="flex items-center text-gray-500 text-sm"><Thermometer size={14} className="mr-1"/> {selectedLoc.temp}°C</div>
                   <div className="flex items-center text-gray-500 text-sm"><Droplets size={14} className="mr-1"/> {selectedLoc.humidity}%</div>
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
  { day: "Wed", temp: 28, aqi: 75, icon: "⛅" },
];
  const getAQIColor = (score) => {
  if (score <= 50) return "bg-green-100 text-green-800";
  if (score <= 100) return "bg-yellow-100 text-yellow-800";
  if (score <= 150) return "bg-orange-100 text-orange-800";
  if (score <= 200) return "bg-red-100 text-red-800";
  return "bg-purple-100 text-purple-800";
};
    return (
      <div className="h-full bg-gray-50 overflow-y-auto animate-fade-in pb-24">
        {/* Header with dynamic color based on AQI */}
        <div className="relative pt-12 pb-10 px-2 rounded-b-[40px] shadow-lg text-white transition-colors duration-500" style={{ backgroundColor: data.color }}>
          <button onClick={() => setActiveTab('map')} className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="text-center mt-2">
            <div className="flex justify-center items-center space-x-1 opacity-90 text-sm mb-1">
              <MapPin size={14} /> <span>{data.name}, Việt Nam</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 tracking-tighter">{data.aqi}</h1>
            <div className="inline-block px-2 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-bold border border-white/30">
              {data.status}
            </div>
            <div className="mt-6 text-sm opacity-90 font-medium max-w-[80%] mx-auto leading-relaxed">
              {data.pm25} µg/m³ PM2.5 
            </div>
            <div className="mt-6 text-sm opacity-90 font-medium max-w-[80%] mx-auto leading-relaxed">
              {data.advice.text}
            </div>
          </div>
        </div>

        <div className="pt-20 px-5 -mt-8 space-y-5">
          {/* Main Weather Grid */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
            <div className="flex flex-col items-center">
               <Thermometer size={20} className="text-orange-500 mb-1" />
               <span className="text-lg font-bold text-gray-800">{data.temp}°</span>
               <span className="text-xs text-gray-400">Nhiệt độ</span>
            </div>
            <div className="flex flex-col items-center">
               <Droplets size={20} className="text-blue-500 mb-1" />
               <span className="text-lg font-bold text-gray-800">{data.humidity}%</span>
               <span className="text-xs text-gray-400">Độ ẩm</span>
            </div>
            <div className="flex flex-col items-center">
               <Wind size={20} className="text-gray-500 mb-1" />
               <span className="text-lg font-bold text-gray-800">{data.wind}</span>
               <span className="text-xs text-gray-400">Gió (km/h)</span>
            </div>
          </div>

          {/* Health Recommendation */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-3 flex items-center">
               <Shield size={18} className="mr-2 text-green-600"/> Khuyến cáo sức khỏe
             </h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                   <span className="text-sm text-gray-700">Hành động nên làm</span>
                   <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{data.advice.action}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={14}/></div>
                  <div className="text-xs text-gray-500">Nhóm người nhạy cảm (người già, trẻ em) nên hạn chế ra ngoài vào thời điểm này.</div>
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
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Diễn biến trong tuần</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={data.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={data.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Area type="monotone" dataKey="val" stroke={data.color} fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-3 ml-1 flex items-center">
            🌤️ Dự báo 3 ngày tiếp theo
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {forecastData.map((day, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center space-y-2">
                <span className="font-semibold text-gray-700">{day.day}</span>
                <span className="text-3xl">{day.icon}</span>
                <span className="font-bold text-gray-800">{day.temp}°C</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getAQIColor(day.aqi)}`}>{day.aqi} AQI</span>
              </div>
            ))}
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