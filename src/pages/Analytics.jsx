import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, MapPinned, History, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert } from "lucide-react";

// 3. ANALYTICS VIEW (BAR CHART ONLY WITH AQI COLORS AND PM2.5 EXPOSURE)
const analyticsData = [
  { day: '-7', date: '12-11', aqi: 7, location: 'P. Dịch Vọng, Cầu Giấy', type: 'past' },
  { day: '-6', date: '13-11', aqi: 15, location: 'P. Láng Hạ, Đống Đa', type: 'past' },
  { day: '-5', date: '14-11', aqi: 30, location: 'X. Bát Tràng, Gia Lâm', type: 'past' },
  { day: '-4', date: '15-11', aqi: 10, location: 'P. Minh Khai, HBT', type: 'past' },
  { day: '-3', date: '16-11', aqi: 30, location: 'P. Dịch Vọng, Cầu Giấy', type: 'past' },
  { day: '-2', date: '17-11', aqi: 45, location: 'Ecopark, Hưng Yên', type: 'past' },
  { day: '-1', date: '18-11', aqi: 40, location: 'Ecopark, Hưng Yên', type: 'past' },
  { day: '0', date: '19-11', aqi: 80, location: 'P. Dịch Vọng, Cầu Giấy', type: 'present' },
  { day: '+1', date: '20-11', aqi: 120, location: 'Dự báo: Cầu Giấy', type: 'future' },
  { day: '+2', date: '21-11', aqi: 110, location: 'Dự báo: Cầu Giấy', type: 'future' },
  { day: '+3', date: '22-11', aqi: 95, location: 'Dự báo: Cầu Giấy', type: 'future' },
  { day: '+4', date: '23-11', aqi: 80, location: 'Dự báo: Hoàn Kiếm', type: 'future' },
  { day: '+5', date: '24-11', aqi: 75, location: 'Dự báo: Tây Hồ', type: 'future' },
  { day: '+6', date: '25-11', aqi: 150, location: 'Dự báo: Cầu Giấy', type: 'future' },
];
const cleanestAreas = [
  { id: 1, name: "Ba Vì, Hà Nội", aqi: 22, pm25: 8 },
  { id: 2, name: "Gia Lâm, Hà Nội", aqi: 38, pm25: 11 },
  { id: 3, name: "Đông Anh, Hà Nội", aqi: 42, pm25: 13 },
  { id: 4, name: "Cầu Giấy, Hà Nội", aqi: 70, pm25: 16 },
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
      <h2 className="font-bold text-gray-800 mb-3 flex items-center">
        <MapPin size={18} className="mr-2 text-green-600" />
        Khu vực đề xuất mọi người di chuyển đến
      </h2>

      <div className="flex flex-col space-y-3">
        {cleanestAreas.map((p, idx) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </div>

              <div>
                <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                {/* <div className="text-[10px] text-gray-500">
                  PM2.5: {p.pm25} µg/m³
                </div> */}
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-bold text-lg"
                style={{ color: getAQIColor(p.aqi) }}
              >
                {p.aqi}
              </div>
              <div className="text-[10px] text-gray-400">AQI</div>
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
    <div className="p-5 pb-28 space-y-6 animate-fade-in h-full overflow-y-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Lịch sử & Dự báo</h1>

      {/* Interactive Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
          <span>Diễn biến 14 ngày</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span className="text-xs text-gray-400">Dựa trên màu AQI</span>
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
        <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100 transition-all">
          <div>
            <div className="text-[10px] left font-bold text-gray-500 uppercase tracking-wider">
              {selectedData.type === 'past' ? 'Lịch sử'
                : selectedData.type === 'present' ? 'Hôm nay'
                : 'Dự báo'} • {selectedData.date}
            </div>
            <div className="font-bold text-gray-800 text-sm mt-0.5 flex items-center">
              <MapPin size={12} className="mr-1"/> 
              Cầu Giấy, Hà Nội
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{color: getAQIColor(selectedData.aqi)}}>
              {selectedData.aqi}
            </div>
            <div className="text-[10px] text-gray-400">AQI</div>
          </div>
        </div>
      </div>

      {/* Route Analysis */}
      <div>
        <h2 className="font-bold text-gray-800 mb-3 flex items-center">
          <MapPinned size={18} className="mr-2 text-purple-600"/> 
          Thống kê mức độ phơi nhiễm
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Past Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-2 opacity-10"><History size={40}/></div>
            <div className="text-xs text-gray-400 mb-1">7 ngày qua</div>

            <div className="text-2xl font-bold text-gray-800">{pastAvg}</div>
            <div className="text-[10px] text-gray-500 mb-3">AQI Trung bình</div>

            <div className="border-t border-dashed border-gray-200 pt-2">
              <div className="text-lg font-bold text-gray-700">
                {pastPm25Avg} <span className="text-[10px] font-normal text-gray-400">µg/m³</span>
              </div>
              <div className="text-[10px] text-gray-500">Phơi nhiễm PM2.5</div>
            </div>

            <div className="mt-2 text-[10px] bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">
              Đã đi qua 4 quận
            </div>
          </div>

          {/* Future Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-2 opacity-10"><TrendingUp size={40}/></div>
            <div className="text-xs text-gray-400 mb-1">7 ngày tới</div>

            <div className="text-2xl font-bold text-blue-600">{futureAvg}</div>
            <div className="text-[10px] text-gray-500 mb-3">AQI Dự kiến</div>

            <div className="border-t border-dashed border-gray-200 pt-2">
              <div className="text-lg font-bold text-blue-600">
                {futurePm25Avg} <span className="text-[10px] font-normal text-blue-400">µg/m³</span>
              </div>
              <div className="text-[10px] text-gray-500">Phơi nhiễm PM2.5</div>
            </div>

            <div className={`mt-2 text-[10px] inline-block px-2 py-0.5 rounded font-bold ${diff < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {diff < 0 ? `Giảm ${Math.abs(diff)} đơn vị` : `Tăng ${diff} đơn vị`}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 italic text-center">
          *Dự báo dựa trên lộ trình di chuyển thường ngày của bạn.
        </div>
        <ExposureCards meanPM25={pastPm25Avg } />
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
      <Card className="rounded-2xl shadow-md bg-white bg-gradient-to-br from-amber-200 ">
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-col items-center space-x-2">
            {/* <Smoking className="w-6 h-6 text-gray-600" /> */}
            <h2 className="text-lg font-semibold">Mức phơi nhiễm tương đương</h2>
          </div>

          <div className="text-xl font-bold text-gray-800">{cig} điếu thuốc</div>
          <p className="text-xs text-gray-600">
            ( 22 µg/m³ PM25 ≈ 1 điếu)
          </p>

          {/* <div className="flex space-x-1">
            {[...Array(Math.min(5, Math.round(cig)))].map((_, i) => (
            //   <Smoking key={i} className="w-5 h-5 text-gray-700" />
            ))}
          </div> */}
        </CardContent>
      </Card>
      <CleanestPlaces />

    </div>
  );
}
