import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaRobot,
  FaUser,
  FaBed,
  FaUserCircle,
  FaSignInAlt,
  FaCompass,
  FaExternalLinkAlt,
  FaCalendarCheck,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

// Extract smart navigation shortcuts from message content and known rooms
const extractShortcuts = (content, rooms = []) => {
  const shortcuts = [];
  const seenPaths = new Set();

  const addShortcut = (label, path, icon) => {
    if (!path || seenPaths.has(path)) return;
    seenPaths.add(path);
    shortcuts.push({ label, path, icon });
  };

  if (!content || typeof content !== 'string') return shortcuts;

  // 1. Extract markdown links: [Label](/path)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const label = match[1].trim();
    const path = match[2].trim();
    if (path.startsWith('/')) {
      let icon = <FaCompass className="text-[10px]" />;
      if (path.includes('/rooms/')) icon = <FaBed className="text-[10px]" />;
      else if (path === '/rooms') icon = <FaBed className="text-[10px]" />;
      else if (path === '/profile') icon = <FaUserCircle className="text-[10px]" />;
      else if (path === '/login' || path === '/register') icon = <FaSignInAlt className="text-[10px]" />;
      addShortcut(label, path, icon);
    }
  }

  // 2. Extract raw path mentions: /rooms/:id, /rooms, /profile, /login, /register
  const rawPathRegex = /(?:^|\s)(\/(?:rooms\/[a-f0-9]+|rooms|profile|login|register|admin))(?:\s|$|[.,?!])/gi;
  while ((match = rawPathRegex.exec(content)) !== null) {
    const path = match[1].trim();
    if (!seenPaths.has(path)) {
      if (path.startsWith('/rooms/')) {
        addShortcut('View Room Details', path, <FaBed className="text-[10px]" />);
      } else if (path === '/rooms') {
        addShortcut('Browse All Rooms', path, <FaBed className="text-[10px]" />);
      } else if (path === '/profile') {
        addShortcut('My Profile & Bookings', path, <FaUserCircle className="text-[10px]" />);
      } else if (path === '/login') {
        addShortcut('Sign In', path, <FaSignInAlt className="text-[10px]" />);
      } else if (path === '/register') {
        addShortcut('Create Account', path, <FaSignInAlt className="text-[10px]" />);
      }
    }
  }

  // 3. Match room names mentioned in content
  const knownRooms = [
    { name: 'Sapphire Deluxe Room', path: '/rooms' },
    { name: 'Ocean View Standard', path: '/rooms' },
    { name: 'Garden Retreat Standard', path: '/rooms' },
    { name: 'Golden Deluxe Suite', path: '/rooms' },
    { name: 'Royal Heritage Suite', path: '/rooms' },
    { name: 'Moonlight Suite', path: '/rooms' },
    { name: 'The Imperial Presidential', path: '/rooms' },
    { name: 'Emerald Presidential Villa', path: '/rooms' },
  ];

  const pool = rooms && rooms.length > 0 ? rooms : knownRooms;
  for (const r of pool) {
    if (r.name && content.toLowerCase().includes(r.name.toLowerCase())) {
      const roomPath = r._id ? `/rooms/${r._id}` : (r.path || '/rooms');
      if (!seenPaths.has(roomPath)) {
        addShortcut(`View ${r.name}`, roomPath, <FaBed className="text-[10px]" />);
      }
    }
  }

  // 4. Intent detection: if message suggests browsing rooms or viewing bookings
  const lower = content.toLowerCase();
  if (
    (lower.includes('browse') || lower.includes('all rooms') || lower.includes('available rooms')) &&
    !seenPaths.has('/rooms')
  ) {
    addShortcut('Browse All Rooms', '/rooms', <FaBed className="text-[10px]" />);
  }
  if (
    (lower.includes('my booking') || lower.includes('your reservation') || lower.includes('profile')) &&
    !seenPaths.has('/profile')
  ) {
    addShortcut('My Profile & Bookings', '/profile', <FaUserCircle className="text-[10px]" />);
  }
  if (lower.includes('book now') && !seenPaths.has('/rooms')) {
    addShortcut('Book a Room', '/rooms', <FaCalendarCheck className="text-[10px]" />);
  }

  return shortcuts.slice(0, 4); // Max 4 clean shortcut chips
};

const ChatMessage = ({ message, rooms = [] }) => {
  const isAssistant = message.role === 'assistant';
  const navigate = useNavigate();

  const shortcuts = useMemo(() => {
    if (!isAssistant) return [];
    return extractShortcuts(message.content, rooms);
  }, [message.content, isAssistant, rooms]);

  return (
    <div
      className={`flex gap-2.5 mb-2.5 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 flex-shrink-0 shadow-sm shadow-amber-500/20">
          <FaRobot className="text-xs" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-[13px] leading-relaxed ${
          isAssistant
            ? 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-sm'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
        }`}
      >
        {isAssistant ? (
          <div>
            <div className="prose prose-invert prose-xs max-w-none prose-p:my-0.5 prose-p:leading-snug prose-ul:my-0.5 prose-li:my-0 prose-headings:my-1 prose-strong:text-amber-300">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    const isInternal = href && href.startsWith('/');
                    if (isInternal) {
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(href);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/50 hover:decoration-amber-400 transition-colors cursor-pointer"
                        >
                          <span>{children}</span>
                          <span className="text-[9px]">↗</span>
                        </button>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        {children}
                        <FaExternalLinkAlt className="text-[8px] inline ml-0.5 opacity-70" />
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Smart Navigation Shortcuts Chips */}
            {shortcuts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-1 text-[10px] text-amber-400/80 mb-1.5 font-medium">
                  <FaCompass className="text-[9px]" /> Quick Shortcuts:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {shortcuts.map((sc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate(sc.path)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white text-[11px] font-medium transition-all hover:scale-[1.02] shadow-sm cursor-pointer group"
                    >
                      <span className="text-amber-400 group-hover:scale-110 transition-transform">
                        {sc.icon}
                      </span>
                      <span>{sc.label}</span>
                      <span className="text-[9px] text-amber-400/60 group-hover:text-amber-300">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="leading-snug">{message.content}</p>
        )}

        <span
          className={`block text-[9px] mt-1 text-right ${
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
        <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 flex-shrink-0">
          <FaUser className="text-[10px]" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
