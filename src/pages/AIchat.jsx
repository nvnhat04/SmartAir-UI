import { useState } from 'react';
import { Send } from 'lucide-react';
  // 5. AI CHAT (Giữ nguyên)
export default function AIChat() {
    const [messages, setMessages] = useState([{ id: 1, sender: 'bot', text: 'Chào bạn! Tôi có thể giúp gì về sức khỏe hôm nay?' }]);
    const [input, setInput] = useState('');
    const send = () => {
      if(!input) return;
      setMessages([...messages, {id: Date.now(), sender: 'user', text: input}]);
      setInput('');
      setTimeout(() => setMessages(p => [...p, {id: Date.now(), sender: 'bot', text: 'Cảm ơn câu hỏi. Bụi PM2.5 có thể gây kích ứng phổi. Bạn nên đeo khẩu trang N95.'}]), 1000);
    };
    return (
      <div className="flex flex-col h-full bg-gray-50 pb-20">
         <div className="bg-white p-4 border-b font-bold">Trợ lý AI</div>
         <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map(m => <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : ''}`}><div className={`p-3 rounded-xl max-w-[80%] text-sm ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border'}`}>{m.text}</div></div>)}
         </div>
         <div className="p-3 bg-white border-t flex space-x-2">
            <input className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" placeholder="Nhập câu hỏi..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
            <button onClick={send} className="p-2 bg-blue-600 text-white rounded-full"><Send size={16}/></button>
         </div>
      </div>
    );
  };