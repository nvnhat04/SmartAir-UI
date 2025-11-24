
import { Filter, Clock, TrendingUp, Bookmark, Share2, ExternalLink} from "lucide-react";
import { useState } from "react";


 // 4. NEWS VIEW (SORTED & CATEGORIZED)
export default function NewsView() {
    const newsDataRaw = [
  { 
    id: 1, 
    title: "Không khí lạnh tràn về, bụi mịn PM2.5 giảm mạnh tại Hà Nội", 
    source: "VnExpress", 
    date: "2024-11-24", 
    category: "Thời tiết", 
    img: "❄️",
    summary: "Đợt không khí lạnh mạnh khiến nhiệt độ giảm 5-7°C, chất lượng không khí được cải thiện đáng kể.",
    readTime: "3 phút đọc",
    views: "2.4k"
  },
  { 
    id: 2, 
    title: "Cảnh báo: Chỉ số UV đạt ngưỡng rất cao tại các tỉnh miền Trung", 
    source: "AirVisual", 
    date: "2024-11-24", 
    category: "Cảnh báo", 
    img: "☀️",
    summary: "Chỉ số UV lên tới 11-12, người dân cần hạn chế ra ngoài từ 11h-15h và sử dụng kem chống nắng.",
    readTime: "2 phút đọc",
    views: "3.1k"
  },
  { 
    id: 3, 
    title: "Top 7 loại cây lọc không khí tốt nhất cho phòng ngủ và văn phòng", 
    source: "Sức khỏe & Đời sống", 
    date: "2024-11-23", 
    category: "Sống xanh", 
    img: "🌿",
    summary: "Cây trầu bà, lưỡi hổ, cây kim tiền... là những lựa chọn lý tưởng giúp lọc không khí và tạo oxy.",
    readTime: "5 phút đọc",
    views: "5.7k"
  },
  { 
    id: 4, 
    title: "Quy định mới về khí thải xe máy sẽ có hiệu lực từ tháng 1/2025", 
    source: "Báo Giao Thông", 
    date: "2024-11-22", 
    category: "Chính sách", 
    img: "🛵",
    summary: "Tiêu chuẩn khí thải Euro 5 bắt buộc với xe máy mới, nhằm giảm thiểu ô nhiễm không khí đô thị.",
    readTime: "4 phút đọc",
    views: "1.8k"
  },
  { 
    id: 5, 
    title: "Nghiên cứu: Ô nhiễm không khí làm tăng 20% nguy cơ mắc bệnh hô hấp", 
    source: "Tạp chí Y học", 
    date: "2024-11-21", 
    category: "Sức khỏe", 
    img: "🏥",
    summary: "Các chuyên gia khuyến cáo đeo khẩu trang N95 khi AQI trên 150 và tăng cường ăn thực phẩm giàu chất chống oxi hóa.",
    readTime: "6 phút đọc",
    views: "4.2k"
  },
  { 
    id: 6, 
    title: "Hà Nội triển khai 50 trạm quan trắc chất lượng không khí tự động", 
    source: "Thanh Niên", 
    date: "2024-11-20", 
    category: "Công nghệ", 
    img: "📡",
    summary: "Hệ thống trạm mới sẽ cung cấp dữ liệu real-time, giúp người dân chủ động phòng tránh ô nhiễm.",
    readTime: "3 phút đọc",
    views: "2.9k"
  },
  { 
    id: 7, 
    title: "Mùa đông năm nay dự báo ít sương mù, AQI trung bình ở mức tốt", 
    source: "Khí tượng Thủy văn", 
    date: "2024-11-19", 
    category: "Thời tiết", 
    img: "🌫️",
    summary: "Điều kiện khí tượng thuận lợi với gió mùa đông bắc mạnh sẽ giúp giảm ô nhiễm không khí.",
    readTime: "4 phút đọc",
    views: "3.5k"
  },
  { 
    id: 8, 
    title: "Hướng dẫn chi tiết: Cách đọc và hiểu chỉ số AQI trên bản đồ", 
    source: "SmartAir Guide", 
    date: "2024-11-18", 
    category: "Hướng dẫn", 
    img: "📊",
    summary: "Giải thích ý nghĩa từng mức AQI và khuyến cáo sức khỏe tương ứng cho từng nhóm người.",
    readTime: "5 phút đọc",
    views: "6.3k"
  },
];
    const [filter, setFilter] = useState('Tất cả');
    const [bookmarked, setBookmarked] = useState([]);
    const categories = ['Tất cả', 'Thời tiết', 'Cảnh báo', 'Sống xanh', 'Chính sách', 'Sức khỏe', 'Công nghệ', 'Hướng dẫn'];
    
    const sortedNews = [...newsDataRaw].sort((a, b) => new Date(b.date) - new Date(a.date));
    const filteredNews = filter === 'Tất cả' ? sortedNews : sortedNews.filter(n => n.category === filter);

    const toggleBookmark = (id) => {
      setBookmarked(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = today - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hôm nay';
      if (diffDays === 1) return 'Hôm qua';
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    };

    return (
      <div className="p-5 pb-28 space-y-6 animate-fade-in h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center">
           <div>
             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tin tức</h1>
             <p className="text-sm text-gray-500 mt-1">Cập nhật mới nhất về chất lượng không khí</p>
           </div>
           <div className="bg-white p-3 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all">
             <Filter size={20} className="text-blue-600"/>
           </div>
        </div>

        {/* Stats Summary */}
        {/* <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-blue-100">
            <div className="text-2xl font-black text-blue-600">{newsDataRaw.length}</div>
            <div className="text-xs text-gray-500 font-semibold">Bài viết</div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-green-100">
            <div className="text-2xl font-black text-green-600">{categories.length - 1}</div>
            <div className="text-xs text-gray-500 font-semibold">Danh mục</div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-purple-100">
            <div className="text-2xl font-black text-purple-600">{bookmarked.length}</div>
            <div className="text-xs text-gray-500 font-semibold">Đã lưu</div>
          </div>
        </div> */}

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
           {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {cat}
              </button>
           ))}
        </div>

        {/* News Count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-gray-600">
            {filteredNews.length} bài viết {filter !== 'Tất cả' && `trong "${filter}"`}
          </p>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <TrendingUp size={14} className="text-green-500"/>
            <span>Cập nhật liên tục</span>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {filteredNews.map(news => (
            <div 
              key={news.id} 
              className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden group cursor-pointer"
            >
               <div className="p-5 space-y-3">
                 {/* Header */}
                 <div className="flex items-start justify-between space-x-3">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                     {news.img}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center space-x-2 mb-2">
                       <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg uppercase tracking-wide">
                         {news.category}
                       </span>
                       <span className="text-[10px] text-gray-400 font-medium flex items-center space-x-1">
                         <Clock size={10}/>
                         <span>{formatDate(news.date)}</span>
                       </span>
                     </div>
                     <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-blue-600 transition-colors">
                       {news.title}
                     </h3>
                   </div>
                 </div>

                 {/* Summary */}
                 <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 pl-1">
                   {news.summary}
                 </p>

                 {/* Footer */}
                 <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                   <div className="flex items-center space-x-4 text-xs text-gray-500">
                     <div className="flex items-center space-x-1">
                       <span className="font-semibold text-blue-600">{news.source}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Clock size={12}/>
                       <span>{news.readTime}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <TrendingUp size={12}/>
                       <span>{news.views}</span>
                     </div>
                   </div>

                   <div className="flex items-center space-x-2">
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleBookmark(news.id);
                       }}
                       className={`p-2 rounded-xl transition-all duration-300 ${
                         bookmarked.includes(news.id)
                           ? 'bg-yellow-100 text-yellow-600 scale-110'
                           : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'
                       }`}
                     >
                       <Bookmark size={14} fill={bookmarked.includes(news.id) ? 'currentColor' : 'none'}/>
                     </button>
                     <button className="p-2 rounded-xl bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                       <Share2 size={14}/>
                     </button>
                     <button className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                       <ExternalLink size={14}/>
                     </button>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };