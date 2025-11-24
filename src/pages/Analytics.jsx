import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, History, MapPin, MapPinned, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import WeekendGetaway from './Weekend';
// 3. ANALYTICS VIEW (BAR CHART ONLY WITH AQI COLORS AND PM2.5 EXPOSURE)
const analyticsData = [
  // 7 ngày qua - Lịch sử di chuyển của user
  { day: '-7', date: '17-11', aqi: 49, location: 'Phường Yên Thường, Quận Gia Lâm', type: 'past' },
  { day: '-6', date: '18-11', aqi: 40, location: 'Xã Xuân Quan, Huyện Văn Giang', type: 'past' },
  { day: '-5', date: '19-11', aqi: 81, location: 'Phường Nhân Chính, Quận Thanh Xuân', type: 'past' },
  { day: '-4', date: '20-11', aqi: 87, location: 'Phường Suối Hoa, TP. Bắc Ninh', type: 'past' },
  { day: '-3', date: '21-11', aqi: 91, location: 'Phường Quang Trung, Quận Hà Đông', type: 'past' },
  { day: '-2', date: '22-11', aqi: 108, location: 'Phường Tân Dân, TP. Việt Trì', type: 'past' },
  { day: '-1', date: '23-11', aqi: 101, location: 'Phường Sao Đỏ, TP. Chí Linh', type: 'past' },
  
  // Hôm nay
  { day: '0', date: '24-11', aqi: 141, location: 'Phường Dịch Vọng, Quận Cầu Giấy', type: 'present' },
  
  // 6 ngày tới - Dự báo dựa trên các địa điểm user đã đi trong 7 ngày qua
  { day: '+1', date: '25-11', aqi: 95, location: 'Dự báo: Quận Gia Lâm', type: 'future', note: 'Bạn đã đến đây ngày 17/11' },
  { day: '+2', date: '26-11', aqi: 85, location: 'Dự báo: Huyện Văn Giang', type: 'future', note: 'Bạn đã đến đây ngày 18/11' },
  { day: '+3', date: '27-11', aqi: 110, location: 'Dự báo: Quận Thanh Xuân', type: 'future', note: 'Bạn đã đến đây ngày 19/11' },
  { day: '+4', date: '28-11', aqi: 105, location: 'Dự báo: TP. Bắc Ninh', type: 'future', note: 'Bạn đã đến đây ngày 20/11' },
  { day: '+5', date: '29-11', aqi: 120, location: 'Dự báo: Quận Hà Đông', type: 'future', note: 'Bạn đã đến đây ngày 21/11' },
  { day: '+6', date: '30-11', aqi: 130, location: 'Dự báo: TP. Việt Trì', type: 'future', note: 'Bạn đã đến đây ngày 22/11' },
  { day: '+7', date: '01-12', aqi: 125, location: 'Dự báo: TP. Chí Linh', type: 'future', note: 'Bạn đã đến đây ngày 23/11' },
];
const cleanestAreas = [
  { id: 1, name: "Xã Xuân Quan, Huyện Văn Giang, Hưng Yên", aqi: 40, pm25: 10 },
  { id: 2, name: "Phường Yên Thường, Quận Gia Lâm, Hà Nội", aqi: 49, pm25: 12 },
  { id: 3, name: "Phường Nhân Chính, Quận Thanh Xuân, Hà Nội", aqi: 81, pm25: 21 },
  { id: 4, name: "Phường Suối Hoa, TP. Bắc Ninh, Bắc Ninh", aqi: 87, pm25: 24 },
];
// 1. Dữ liệu người dùng (Lấy từ GPS & API)
  const userLocation = {
    name: "Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
    aqi: 141
  };

  // 2. Dữ liệu các điểm du lịch theo bán kính (Lấy từ API Backend của bạn)
  const allDestinations = [
    // Bán kính 50km
    {
      id: 1,
      name: "Ecopark, Hưng Yên",
      aqi: 40,
      weatherType: "sun",
      temp: 24,
      distance: 18,
      driveTime: "35 phút",
      recommendation: "Công viên sinh thái, hồ nước rộng, đạp xe dạo chơi"
    },
    {
      id: 2,
      name: "Công viên Yên Sở",
      aqi: 45,
      weatherType: "sun",
      temp: 23,
      distance: 12,
      driveTime: "25 phút",
      recommendation: "Hồ rộng, chạy bộ, picnic gia đình, không gian xanh"
    },
    {
      id: 3,
      name: "Làng cổ Đường Lâm",
      aqi: 48,
      weatherType: "cloud",
      temp: 22,
      distance: 45,
      driveTime: "1 giờ 10 phút",
      recommendation: "Làng cổ 1200 năm, nhà sàn truyền thống, ẩm thực đặc sản"
    },
    {
      id: 4,
      name: "Khu du lịch Sơn Tây",
      aqi: 44,
      weatherType: "sun",
      temp: 21,
      distance: 42,
      driveTime: "1 giờ",
      recommendation: "Thành cổ Sơn Tây, núi non hùng vĩ, không khí trong lành"
    },
    {
      id: 5,
      name: "Vườn Vua Resort",
      aqi: 38,
      weatherType: "sun",
      temp: 25,
      distance: 35,
      driveTime: "50 phút",
      recommendation: "Resort sinh thái, vườn cây ăn trái, trải nghiệm làm vườn"
    },

    // Bán kính 100km
    {
      id: 6,
      name: "Ba Vì, Hà Nội",
      aqi: 42,
      weatherType: "sun",
      temp: 21,
      distance: 65,
      driveTime: "1 giờ 45 phút",
      recommendation: "Vườn quốc gia, suối nước nóng, cắm trại rừng thông"
    },
    {
      id: 7,
      name: "Chùa Hương, Mỹ Đức",
      aqi: 48,
      weatherType: "cloud",
      temp: 22,
      distance: 60,
      driveTime: "1 giờ 40 phút",
      recommendation: "Di tích lịch sử, chèo thuyền suối Yến, núi non hữu tình"
    },
    {
      id: 8,
      name: "Đại Lải, Vĩnh Phúc",
      aqi: 38,
      weatherType: "sun",
      temp: 23,
      distance: 55,
      driveTime: "1 giờ 20 phút",
      recommendation: "Hồ Đại Lải xanh mát, resort nghỉ dưỡng, thể thao nước"
    },
    {
      id: 9,
      name: "Tam Đảo, Vĩnh Phúc",
      aqi: 35,
      weatherType: "cloud",
      temp: 18,
      distance: 85,
      driveTime: "2 giờ 15 phút",
      recommendation: "Săn mây, check-in Thác Bạc, khí hậu mát mẻ quanh năm"
    },
    {
      id: 10,
      name: "Thung Nham, Ninh Bình",
      aqi: 36,
      weatherType: "sun",
      temp: 24,
      distance: 95,
      driveTime: "2 giờ 30 phút",
      recommendation: "Hang động, vườn chim, kayaking, cảnh quan tuyệt đẹp"
    },

    // Bán kính 150km
    {
      id: 11,
      name: "Tràng An, Ninh Bình",
      aqi: 34,
      weatherType: "sun",
      temp: 25,
      distance: 110,
      driveTime: "2 giờ 45 phút",
      recommendation: "Di sản thế giới, chèo thuyền hang động, non nước hữu tình"
    },
    {
      id: 12,
      name: "Pù Luông, Thanh Hóa",
      aqi: 30,
      weatherType: "cloud",
      temp: 20,
      distance: 145,
      driveTime: "3 giờ 30 phút",
      recommendation: "Ruộng bậc thang, homestay, trekking, văn hóa Thái"
    },
    {
      id: 13,
      name: "Bái Đính, Ninh Bình",
      aqi: 37,
      weatherType: "sun",
      temp: 23,
      distance: 105,
      driveTime: "2 giờ 40 phút",
      recommendation: "Chùa lớn nhất Việt Nam, kiến trúc đồ sộ, cầu Phật"
    },
    {
      id: 14,
      name: "Mù Cang Chải, Yên Bái",
      aqi: 28,
      weatherType: "cloud",
      temp: 19,
      distance: 140,
      driveTime: "3 giờ 20 phút",
      recommendation: "Ruộng bậc thang đẹp nhất VN, Mâm Xôi, Lùng Cúng"
    },
    {
      id: 15,
      name: "Cúc Phương, Ninh Bình",
      aqi: 33,
      weatherType: "sun",
      temp: 22,
      distance: 120,
      driveTime: "3 giờ",
      recommendation: "Vườn quốc gia, động vật quý hiếm, trekking rừng nguyên sinh"
    },

    // Bán kính 200km
    {
      id: 16,
      name: "Cát Bà, Hải Phòng",
      aqi: 32,
      weatherType: "sun",
      temp: 26,
      distance: 165,
      driveTime: "4 giờ",
      recommendation: "Biển đảo, vườn quốc gia, leo núi, kayaking vịnh Lan Hạ"
    },
    {
      id: 17,
      name: "Sapa, Lào Cai",
      aqi: 25,
      weatherType: "cloud",
      temp: 16,
      distance: 195,
      driveTime: "5 giờ",
      recommendation: "Thị trấn mù sương, ruộng bậc thang, Fansipan, văn hóa vùng cao"
    },
    {
      id: 18,
      name: "Hạ Long, Quảng Ninh",
      aqi: 35,
      weatherType: "sun",
      temp: 25,
      distance: 170,
      driveTime: "4 giờ 15 phút",
      recommendation: "Di sản thế giới, du thuyền vịnh, hang động kỳ vĩ"
    },
    {
      id: 19,
      name: "Đồ Sơn, Hải Phòng",
      aqi: 38,
      weatherType: "sun",
      temp: 27,
      distance: 155,
      driveTime: "3 giờ 45 phút",
      recommendation: "Bãi biển, hải sản tươi ngon, resort nghỉ dưỡng"
    },
    {
      id: 20,
      name: "Yên Tử, Quảng Ninh",
      aqi: 31,
      weatherType: "cloud",
      temp: 20,
      distance: 180,
      driveTime: "4 giờ 30 phút",
      recommendation: "Thiền viện Trúc Lâm, cáp treo, hành hương, view núi đẹp"
    }
  ];
const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#7f1d1d';
};
function CleanestPlaces() {
  return (
    <div className="mt-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 rounded-xl shadow-md">
          <MapPin size={20} className="text-white"/>
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Địa điểm không khí tốt nhất</h2>
          <p className="text-xs text-gray-500">Gợi ý di chuyển đến khu vực sạch hơn</p>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        {cleanestAreas.map((p, idx) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 flex items-center justify-between cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {idx + 1}
              </div>

              <div>
                <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                  PM2.5: {p.pm25} µg/m³
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-black text-2xl"
                style={{ color: getAQIColor(p.aqi) }}
              >
                {p.aqi}
              </div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">AQI</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function AnalyticsView () {
  const [selectedIdx, setSelectedIdx] = useState(7); 

  const selectedData = analyticsData[selectedIdx];

  const pastAvg = Math.round(analyticsData.slice(0, 8).reduce((acc, cur) => acc + cur.aqi, 0) / 8);
  const futureAvg = Math.round(analyticsData.slice(8).reduce((acc, cur) => acc + cur.aqi, 0) / 6);
  const diff = futureAvg - pastAvg;

  const pastPm25Avg = (pastAvg * 0.6).toFixed(1);
  const futurePm25Avg = (futureAvg * 0.6).toFixed(1);

  return (
    <div className="p-5 pb-28 space-y-6 animate-fade-in h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-gray-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lịch sử & Dự báo</h1>
          <p className="text-sm text-gray-500 mt-1">Phân tích chất lượng không khí 14 ngày</p>
        </div>
        {/* <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
          <BarChart2 className="text-blue-600" size={24} />
        </div> */}
      </div>

      {/* Interactive Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
        <div className="text-sm font-bold text-gray-800 mb-5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-lg">Diễn biến 15 ngày</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-xs text-gray-500">Mã màu AQI</span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
              <XAxis dataKey="date" />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} width={30} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display:'none'}} />
              <ReferenceLine x="0" stroke="#94a3b8" strokeDasharray="3 3" />

              <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                {analyticsData.map((entry, index) => {
                  const color = getAQIColor(entry.aqi);
                  const isSelected = index === selectedIdx;

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      stroke={isSelected ? '#000' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                      opacity={isSelected ? 1 : 0.8}
                      onClick={() => setSelectedIdx(index)}   
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Info Box */}
        <div className="mt-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 flex items-center justify-between border-2 border-blue-200 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white px-2 py-1 rounded-md">
                {selectedData.type === 'past' ? '📊 Lịch sử'
                  : selectedData.type === 'present' ? '📍 Hôm nay'
                  : '🔮 Dự báo'}
              </div>
              <span className="text-[10px] font-semibold text-gray-500">{selectedData.date}</span>
            </div>
            <div className="font-bold text-gray-800 text-base mt-1 flex items-center">
              <MapPin size={14} className="mr-1.5 text-blue-500"/> 
              {selectedData.location}
            </div>
            {selectedData.note && (
              <div className="mt-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block border border-blue-200">
                💡 {selectedData.note}
              </div>
            )}
          </div>
          <div className="text-right ml-4">
            <div className="text-3xl font-black" style={{color: getAQIColor(selectedData.aqi)}}>
              {selectedData.aqi}
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">AQI</div>
          </div>
        </div>
      </div>

      {/* Route Analysis */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-md">
            <MapPinned size={20} className="text-white"/>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Thống kê mức độ phơi nhiễm</h2>
            <p className="text-xs text-gray-500">Dựa trên lộ trình thường ngày của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Past Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border-2 border-gray-200 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute right-0 top-0 p-3 opacity-5"><History size={50}/></div>
            <div className="flex items-center space-x-2 mb-2">
              <History size={16} className="text-gray-600"/>
              <div className="text-xs font-bold text-gray-600">7 NGÀY QUA</div>
            </div>

            <div className="text-3xl font-black text-gray-800 mb-1">{pastAvg}</div>
            <div className="text-xs font-semibold text-gray-500 mb-3">AQI Trung bình</div>

            <div className="border-t-2 border-dashed border-gray-300 pt-3 mt-2">
              <div className="text-xl font-bold text-gray-700">
                {pastPm25Avg} <span className="text-xs font-normal text-gray-400">µg/m³</span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">Phơi nhiễm PM2.5</div>
            </div>

            <div className="mt-3 text-[11px] bg-white font-semibold inline-block px-3 py-1 rounded-lg text-gray-700 shadow-sm">
              📍 7 địa điểm đã ghé
            </div>
          </div>

          {/* Future Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl border-2 border-blue-200 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute right-0 top-0 p-3 opacity-5"><TrendingUp size={50}/></div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={16} className="text-blue-600"/>
              <div className="text-xs font-bold text-blue-600"> 7 NGÀY TỚI</div>
            </div>

            <div className="text-3xl font-black text-blue-600 mb-1">{futureAvg}</div>
            <div className="text-xs font-semibold text-gray-500 mb-3">AQI Dự kiến</div>

            <div className="border-t-2 border-dashed border-blue-300 pt-3 mt-2">
              <div className="text-xl font-bold text-blue-600">
                {futurePm25Avg} <span className="text-xs font-normal text-blue-400">µg/m³</span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">Phơi nhiễm PM2.5</div>
            </div>

            <div className={`mt-3 text-[11px] font-bold inline-block px-3 py-1 rounded-lg shadow-sm ${diff < 0 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'}`}>
              {diff < 0 ? `📉 Giảm ${Math.abs(diff)} đơn vị` : `📈 Tăng ${diff} đơn vị`}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm">
          <p className="text-xs text-gray-700 font-medium leading-relaxed">
            <span className="font-bold text-blue-600">💡 Dự báo thông minh:</span> Các địa điểm dự báo dựa trên lộ trình thường ngày của bạn trong 7 ngày qua. 
            Hệ thống phân tích các vị trí bạn thường lui tới để đưa ra dự báo AQI chính xác hơn.
          </p>
        </div>
        <ExposureCards meanPM25={pastPm25Avg } />
        <WeekendGetaway 
          currentLocation={userLocation} 
          destinations={allDestinations} 
        />
        <div className="mt-8 text-center bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            ✨ Dữ liệu được cập nhật theo thời gian thực
          </p>
        </div>
      </div>
    </div>
  );
};


function ExposureCards({ meanPM25 = 48 }) {
  const pes = Math.min(100, (meanPM25 / 55) * 100);
  const cig = (meanPM25 / 22).toFixed(1);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Personal Exposure Score */}
      {/* <Card className="rounded-2xl bg-gradient-to-br from-amber-200  shadow-lg">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-red-700" />
            <h3 className="text-xl font-semibold">Mức độ phơi nhiễm cá nhân</h3>
           
          </div>
         <p className='text-xs text-gray-600'>* Thống kê trung bình trong 7 ngày qua.</p>
          <div className="text-4xl font-bold text-red-900">{pes.toFixed(0)}/100</div>
          <p className="text-sm text-gray-700">PM2.5 trung bình: {meanPM25} µg/m³</p>

          <Progress value={pes} className="h-3" />
          <p className='text-xs text-gray-600'>(55 µg/m³ PM25 = 100 điểm)</p>
        </CardContent>
      </Card> */}

      {/* Cigarette Equivalent */}
      <Card className="rounded-3xl shadow-lg bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 border-2 border-amber-200 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <span className="text-3xl">🚬</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Mức phơi nhiễm tương đương</h2>
          </div>

          <div className="text-center bg-white rounded-2xl p-4 shadow-md">
            <div className="text-4xl font-black text-orange-600">{cig}</div>
            <div className="text-sm font-semibold text-gray-600 mt-1">điếu thuốc / tuần</div>
          </div>
          
          <div className="bg-white/50 rounded-xl p-3 border border-orange-200">
            <p className="text-xs text-gray-700 text-center font-medium">
              💡 22 µg/m³ PM2.5 ≈ 1 điếu thuốc
            </p>
          </div>

          {/* <div className="flex space-x-1">
            {[...Array(Math.min(5, Math.round(cig)))].map((_, i) => (
            //   <Smoking key={i} className="w-5 h-5 text-gray-700" />
            ))}
          </div> */}
        </CardContent>
      </Card>
      

    </div>
  );
}
