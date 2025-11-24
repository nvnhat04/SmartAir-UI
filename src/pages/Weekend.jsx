import React, { useMemo } from 'react';
import { MapPin, Wind, Sun, ArrowRight, Navigation, CloudRain, Cloud } from 'lucide-react';

// --- 1. Sub-components & Helpers (Phần bổ trợ) ---

// Helper: Xác định màu sắc dựa trên AQI
const getAQITheme = (aqi) => {
  if (aqi <= 50) return { color: "text-green-600", bg: "bg-green-100", border: "border-green-200", label: "Tốt", indicator: "bg-green-500" };
  if (aqi <= 100) return { color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200", label: "Trung bình", indicator: "bg-yellow-500" };
  if (aqi <= 150) return { color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200", label: "Kém", indicator: "bg-orange-500" };
  return { color: "text-red-600", bg: "bg-red-100", border: "border-red-200", label: "Xấu", indicator: "bg-red-600" };
};

// Helper: Icon thời tiết
const WeatherIcon = ({ type, className }) => {
  switch(type) {
    case 'rain': return <CloudRain size={16} className={`text-blue-500 ${className}`} />;
    case 'cloud': return <Cloud size={16} className={`text-gray-500 ${className}`} />;
    default: return <Sun size={16} className={`text-orange-500 ${className}`} />;
  }
};

// --- 2. Main Component ---

const WeekendGetaway = ({ 
  currentLocation = { name: "Vị trí của bạn", aqi: 150 }, // Default prop
  destinations = [] // Danh sách địa điểm gợi ý
}) => {

  // Logic: Sắp xếp địa điểm từ Sạch nhất -> Bẩn nhất
  const sortedDestinations = useMemo(() => {
    return [...destinations].sort((a, b) => a.aqi - b.aqi);
  }, [destinations]);

  // Logic: Lấy địa điểm tốt nhất để so sánh
  const bestDestination = sortedDestinations[0];
  
  // Logic: Tính % giảm bụi
  const reductionPercentage = bestDestination 
    ? Math.round((1 - (bestDestination.aqi / currentLocation.aqi)) * 100) 
    : 0;

  const currentTheme = getAQITheme(currentLocation.aqi);
  const bestTheme = bestDestination ? getAQITheme(bestDestination.aqi) : null;

  if (!bestDestination) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 rounded-3xl overflow-hidden shadow-xl font-sans border border-gray-100">
      
      {/* SECTION 1: HEADER & COMPARISON */}
      <div className="bg-white p-5 pb-8 rounded-b-3xl shadow-sm z-10">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-lg font-bold text-gray-800">Trốn bụi cuối tuần 🌿</h2>
                <p className="text-xs text-gray-500">Dựa trên dự báo 48h tới</p>
            </div>
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-600 font-medium">
                Bán kính 100km
            </span>
        </div>

        {/* Card So Sánh Chính */}
        <div className="flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 relative overflow-hidden">
          
          {/* Bên Trái: Nơi ở (Ô nhiễm) */}
          <div className="flex flex-col items-center w-1/3 z-10">
            <span className="text-[10px] font-semibold text-gray-500 mb-1 truncate w-full text-center">{currentLocation.name}</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${currentTheme.indicator}`}>
              {currentLocation.aqi}
            </div>
            <span className={`text-[10px] font-bold mt-1 uppercase ${currentTheme.color}`}>{currentTheme.label}</span>
          </div>

          {/* Ở Giữa: Mũi tên & Lợi ích */}
          <div className="flex flex-col items-center justify-center w-1/3 z-10 px-1">
            <div className="bg-white p-1.5 rounded-full shadow-sm mb-1">
                <ArrowRight size={14} className="text-gray-400" />
            </div>
            {reductionPercentage > 0 && (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-green-200">
                Giảm {reductionPercentage}% bụi
                </span>
            )}
          </div>

          {/* Bên Phải: Nơi đến (Sạch) */}
          <div className="flex flex-col items-center w-1/3 z-10">
            <span className="text-[10px] font-semibold text-gray-500 mb-1 truncate w-full text-center">{bestDestination.name}</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md animate-[bounce_2s_infinite] ${bestTheme.indicator}`}>
              {bestDestination.aqi}
            </div>
            <span className={`text-[10px] font-bold mt-1 uppercase ${bestTheme.color}`}>{bestTheme.label}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIST SUGGESTIONS */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gợi ý hàng đầu</h3>
        
        {sortedDestinations.map((dest) => {
          const theme = getAQITheme(dest.aqi);
          const cleanRatio = (currentLocation.aqi / dest.aqi).toFixed(1);

          return (
            <div key={dest.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
              {/* Header của Card con */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
                     <Sun size={20} className={theme.color} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{dest.name}</h4>
                    <div className="flex items-center text-[10px] text-gray-500 gap-1">
                       <MapPin size={10} /> {dest.distance}km • {dest.driveTime}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${theme.bg} ${theme.color} ${theme.border}`}>
                  AQI {dest.aqi}
                </span>
              </div>

              {/* Thông số chi tiết */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                 <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                    <Wind size={14} className="text-blue-500"/>
                    <div>
                        <p className="text-[10px] text-gray-500">Độ sạch</p>
                        <p className="text-xs font-bold text-blue-600">Gấp {cleanRatio} lần</p>
                    </div>
                 </div>
                 <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                    <WeatherIcon type={dest.weatherType} />
                    <div>
                        <p className="text-[10px] text-gray-500">Thời tiết</p>
                        <p className="text-xs font-bold text-gray-700">{dest.temp}°C</p>
                    </div>
                 </div>
              </div>
              
              {/* Footer & CTA */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                  <span className="text-[10px] text-gray-500 italic">💡 {dest.recommendation}</span>
                  {/* <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                      Chỉ đường <Navigation size={10} />
                  </button> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekendGetaway;