import { Bot, Heart, Lightbulb, MessageCircle, Send, Sparkles, TrendingUp, User, Wind } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

  // 5. AI CHAT (Enhanced UI)
export default function AIChat() {
    const [messages, setMessages] = useState([
      { 
        id: 1, 
        sender: 'bot', 
        text: 'Xin chào! 👋 Tôi là trợ lý AI chuyên về chất lượng không khí và sức khỏe. Tôi có thể giúp bạn:', 
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const quickSuggestions = [
      { icon: <Wind size={14} />, text: 'AQI hôm nay thế nào?' },
      { icon: <Heart size={14} />, text: 'Lời khuyên sức khỏe' },
      { icon: <TrendingUp size={14} />, text: 'Dự báo tuần này' },
      { icon: <Lightbulb size={14} />, text: 'Cách phòng tránh ô nhiễm' },
    ];

    const botResponses = [
      'Dựa trên dữ liệu hiện tại, chất lượng không khí đang ở mức trung bình. Bạn nên hạn chế hoạt động ngoài trời từ 11h-15h.',
      'PM2.5 đang ở ngưỡng cao. Tôi khuyên bạn nên đeo khẩu trang N95 khi ra ngoài và sử dụng máy lọc không khí trong nhà.',
      'Dự báo tuần này cho thấy chất lượng không khí sẽ được cải thiện nhờ gió mùa đông bắc. AQI dự kiến giảm xuống 50-80.',
      'Để phòng tránh ô nhiễm không khí: 1) Theo dõi AQI hàng ngày, 2) Đeo khẩu trang khi AQI > 100, 3) Đóng cửa sổ vào giờ cao điểm, 4) Trồng cây xanh trong nhà.',
      'Cảm ơn câu hỏi! Tôi đang phân tích dữ liệu để đưa ra câu trả lời chính xác nhất. Bạn có thể hỏi thêm về AQI, thời tiết, hoặc lời khuyên sức khỏe.',
    ];

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const send = (text = input) => {
      if(!text.trim()) return;
      
      const userMessage = {
        id: Date.now(), 
        sender: 'user', 
        text: text,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);
      
      setTimeout(() => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages(prev => [...prev, {
          id: Date.now(), 
          sender: 'bot', 
          text: randomResponse,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 1500);
    };

    const handleSuggestionClick = (suggestion) => {
      send(suggestion);
    };

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-purple-50">
         {/* Header */}
         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 shadow-lg">
           <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
               <Sparkles size={24} className="text-blue-600" />
             </div>
             <div className="flex-1">
               <h1 className="text-xl font-bold text-white">Trợ lý AI</h1>
               <div className="flex items-center space-x-2 text-sm text-blue-100">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 <span>Đang hoạt động</span>
               </div>
             </div>
             <MessageCircle size={24} className="text-white/80" />
           </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
            {messages.map((m, idx) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`flex items-start space-x-2 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-br from-green-400 to-emerald-500'
                  }`}>
                    {m.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                      m.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">{m.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-gradient-to-br from-green-400 to-emerald-500">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-md border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
         </div>

         {/* Quick Suggestions */}
         {messages.length <= 1 && (
           <div className="px-4 pb-3">
             <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center space-x-1">
               <Lightbulb size={12} />
               <span>Gợi ý câu hỏi:</span>
             </p>
             <div className="grid grid-cols-2 gap-2">
               {quickSuggestions.map((suggestion, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleSuggestionClick(suggestion.text)}
                   className="flex items-center space-x-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-3 text-xs font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                 >
                   {suggestion.icon}
                   <span>{suggestion.text}</span>
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* Input Area */}
         <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-2 border-2 border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all duration-300">
              <input 
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" 
                placeholder="Nhập câu hỏi về chất lượng không khí..." 
                value={input} 
                onChange={e=>setInput(e.target.value)} 
                onKeyDown={e=>e.key==='Enter'&&send()}
              />
              <button 
                onClick={() => send()} 
                disabled={!input.trim()}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  input.trim() 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18}/>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </p>
         </div>
      </div>
    );
  };