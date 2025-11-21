
import { useState } from "react";
import { Filter } from "lucide-react";


 // 4. NEWS VIEW (SORTED & CATEGORIZED)
export default function NewsView() {
    const newsDataRaw = [
  { id: 1, title: "Không khí lạnh tràn về, bụi mịn PM2.5 giảm mạnh", source: "VnExpress", date: "2023-11-19", category: "Thời tiết", img: "❄️" },
  { id: 2, title: "Cảnh báo: Chỉ số UV cao tại Hà Nội trưa nay", source: "AirVisual", date: "2023-11-19", category: "Cảnh báo", img: "☀️" },
  { id: 3, title: "5 loại cây lọc không khí tốt cho phòng ngủ", source: "Sức khỏe", date: "2023-11-18", category: "Sống xanh", img: "🌿" },
  { id: 4, title: "Quy định mới về khí thải xe máy từ 2024", source: "Báo Giao Thông", date: "2023-11-15", category: "Chính sách", img: "🛵" },
];
    const [filter, setFilter] = useState('Tất cả');
    const categories = ['Tất cả', 'Thời tiết', 'Cảnh báo', 'Sống xanh', 'Chính sách'];
    
    const sortedNews = [...newsDataRaw].sort((a, b) => new Date(b.date) - new Date(a.date));
    const filteredNews = filter === 'Tất cả' ? sortedNews : sortedNews.filter(n => n.category === filter);

    return (
      <div className="p-5 pb-28 space-y-5 animate-fade-in h-full overflow-y-auto bg-gray-50">
        <div className="flex justify-between items-center">
           <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
           <div className="bg-white p-2 rounded-full shadow-sm border"><Filter size={16} className="text-gray-500"/></div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
           {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                {cat}
              </button>
           ))}
        </div>

        <div className="space-y-3">
          {filteredNews.map(news => (
            <div key={news.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex space-x-4 hover:shadow-md transition-shadow cursor-pointer">
               <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{news.img}</div>
               <div className="flex-1 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center space-x-2 mb-1">
                       <span className="text-[9px] font-bold bg-gray-100 px-1.5 rounded text-gray-500 uppercase">{news.category}</span>
                       <span className="text-[9px] text-gray-400">• {news.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">{news.title}</h3>
                 </div>
                 <div className="flex items-center text-[10px] text-gray-500 mt-2">
                   <span className="font-medium text-blue-600">{news.source}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };