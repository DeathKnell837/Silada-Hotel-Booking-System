import React from 'react';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

const SentimentBadge = ({ category, score }) => {
  if (category === 'Positive') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <FaSmile className="text-emerald-400 text-sm" />
        Positive AI Sentiment {score !== undefined && `(${(score * 100).toFixed(0)}%)`}
      </span>
    );
  }

  if (category === 'Negative') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <FaFrown className="text-rose-400 text-sm" />
        Needs Attention {score !== undefined && `(${(score * 100).toFixed(0)}%)`}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <FaMeh className="text-amber-400 text-sm" />
      Neutral AI Sentiment
    </span>
  );
};

export default SentimentBadge;
