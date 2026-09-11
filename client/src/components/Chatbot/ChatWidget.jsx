import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaTrashAlt, FaCommentDots } from 'react-icons/fa';
import { chatbotService } from '../../services/dataService';
import ChatMessage from './ChatMessage';

const getSessionId = () => {
  let id = localStorage.getItem('silada_chat_session');
  if (!id) {
    id = `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    localStorage.setItem('silada_chat_session', id);
  }
  return id;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [engineInfo, setEngineInfo] = useState({
    provider: 'Groq / Gemini AI',
    model: '',
    status: 'online',
  });
  const messagesEndRef = useRef(null);

  const sessionId = getSessionId();

  useEffect(() => {
    chatbotService
      .getStatus()
      .then((res) => {
        if (res.data?.provider) {
          setEngineInfo(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const quickPrompts = [
    'What rooms are available?',
    'What are your check-in & check-out times?',
    'Recommend a luxury suite for 4 guests',
    'What payment methods do you accept?',
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const res = await chatbotService.getHistory(sessionId);
      if (res.data?.messages?.length > 0) {
        setMessages(res.data.messages);
      } else {
        // Welcome message
        setMessages([
          {
            role: 'assistant',
            content:
              '👋 Welcome to **Silada Luxury Hotel & Resort**! I am your AI Virtual Concierge. How may I assist your stay today?',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await chatbotService.sendMessage(sessionId, query);
      if (res.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.message || err.message || 'Unable to connect to AI service';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **AI Service Error:** ${errorDetail}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await chatbotService.clearHistory(sessionId);
      setMessages([
        {
          role: 'assistant',
          content: 'Chat history cleared. How can I help you next?',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105"
        >
          <FaRobot className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-sm font-serif">Silada AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20">
                <FaRobot className="text-lg" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-neutral-100 text-base flex items-center gap-2">
                  Silada AI Concierge
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-sans border border-emerald-500/30">
                    24/7 Online
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Powered by {engineInfo.provider}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-xl transition"
              >
                <FaTrashAlt className="text-sm" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-xl transition"
              >
                <FaTimes className="text-base" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-neutral-950/80 space-y-2 custom-scrollbar">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs py-2 px-3 bg-neutral-900/60 rounded-xl w-max border border-neutral-800 animate-pulse">
                <FaCommentDots className="text-amber-400 animate-bounce" />
                <span>Silada AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 py-2 bg-neutral-900/40 border-t border-neutral-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-900 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-800 hover:border-amber-500/30 whitespace-nowrap transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, rates, policies..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none placeholder:text-neutral-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 rounded-xl transition font-bold disabled:opacity-40 shadow-md shadow-amber-500/20"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
