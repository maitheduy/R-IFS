import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Send, Bot, User, Loader2, Key, Settings, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI chuyên gia toán học fractal và R-IFS (Rotation-Iterated Function Systems). Bạn có thể hỏi tôi bất kỳ câu hỏi nào về bài báo RC-000004-RIS-M0, thuật toán Chaos Game, số phức, định lý Hutchinson hoặc cách viết mã kiểm chứng Lean 4.\n\n[Mẹo: Bạn có thể nhập OpenAI API Key ở góc trên nếu muốn dùng OpenAI GPT khi deploy nơi khác!]',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAiKey, setOpenAiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key') || '';
    if (savedKey) {
      setOpenAiKey(savedKey);
      setKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('openai_api_key', openAiKey.trim());
    setKeySaved(true);
    setShowKeyInput(false);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      let answer = '';
      const trimmedKey = openAiKey.trim();

      if (trimmedKey.startsWith('sk-')) {
        // Use OpenAI API
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${trimmedKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Bạn là trợ lý AI chuyên về toán học cao cấp, hệ thống hàm lặp quay R-IFS (Rotation Iterated Function Systems) và hình học fractal (dựa trên bài báo RC-000004-RIS-M0 của F-Group về tam giác Sierpiński với phép quay R(z) = ωz và phép co f(z) = z/2 + 1). Hãy trả lời chi tiết, chính xác, bằng tiếng Việt (hoặc tiếng Anh nếu người dùng hỏi tiếng Anh), rõ ràng và có cấu trúc toán học.',
              },
              {
                role: 'user',
                content: textToSend,
              },
            ],
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || 'Lỗi kết nối OpenAI API');
        }

        const data = await res.json();
        answer = data.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ OpenAI.';
      } else {
        // Use Google Gemini API
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Bạn là trợ lý AI chuyên về toán học cao cấp, hệ thống hàm lặp quay R-IFS (Rotation Iterated Function Systems) và hình học fractal (dựa trên bài báo RC-000004-RIS-M0 của F-Group về tam giác Sierpiński với phép quay R(z) = ωz và phép co f(z) = z/2 + 1). Hãy trả lời chi tiết, chính xác, bằng tiếng Việt (hoặc tiếng Anh nếu người dùng hỏi tiếng Anh), rõ ràng và có cấu trúc toán học:

Câu hỏi của người dùng: ${textToSend}`,
        });

        answer = response.text || 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Đã xảy ra lỗi khi gọi AI API: ${err.message || 'Lỗi không xác định'}. Vui lòng kiểm tra lại API key hoặc kết nối mạng.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Giải thích ý nghĩa của R-IFS và định lý Hutchinson",
    "Tại sao tập MinInv lại trùng với attractor của IFS ba ánh xạ?",
    "Gợi ý cách hình thức hóa định lý này bằng Lean 4",
    "Làm thế nào để tạo ra R-IFS cho ngũ giác đều?",
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] flex flex-col justify-between space-y-4">
      {/* Header & API Key Settings */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Mathematical Consultant</h2>
            <p className="text-xs text-purple-300">
              {openAiKey.startsWith('sk-') ? 'Đang sử dụng OpenAI GPT-4o-mini' : 'Đang sử dụng Google Gemini AI'}
            </p>
          </div>
        </div>

        {/* OpenAI Key Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{openAiKey ? 'Đã cấu hình OpenAI Key' : 'Nhập OpenAI API Key'}</span>
            {keySaved && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* API Key Modal / Drawer */}
      {showKeyInput && (
        <div className="bg-slate-900 border border-purple-500/40 p-4 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Cấu hình OpenAI API Key (Tùy chọn cho Deployment)</span>
            </h3>
            <button
              onClick={() => setShowKeyInput(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Đóng
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Nhập khóa API OpenAI của bạn (bắt đầu bằng <span className="font-mono text-amber-300">sk-...</span>). Khi được nhập, trợ lý AI sẽ tự động sử dụng OpenAI GPT để hoạt động độc lập ngay cả khi deploy ở server ngoài. Nếu để trống, hệ thống sẽ sử dụng Google Gemini.
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-purple-600/30"
            >
              Lưu Key
            </button>
          </div>
        </div>
      )}

      {/* Messages Box */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[55vh]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>{openAiKey.startsWith('sk-') ? 'OpenAI GPT đang trả lời...' : 'Gemini AI đang trả lời...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/20 rounded-xl text-xs font-medium transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi về R-IFS, định lý hoặc mã Lean 4..."
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder-slate-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
