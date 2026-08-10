import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 mb-3 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 flex-shrink-0 shadow-md shadow-amber-500/20">
          <FaRobot className="text-sm" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          isAssistant
            ? 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p>{message.content}</p>
        )}

        <span
          className={`block text-[10px] mt-1 text-right ${
            isAssistant ? 'text-neutral-500' : 'text-neutral-900/70 font-semibold'
          }`}
        >
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 flex-shrink-0">
          <FaUser className="text-xs" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
