import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import SentimentBadge from './SentimentBadge';

const ReviewList = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 bg-neutral-900/40 rounded-xl border border-neutral-800/60">
        No guest reviews yet. Be the first to leave a review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div
          key={rev._id}
          className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 backdrop-blur-sm hover:border-neutral-700/80 transition"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              {rev.user?.avatar ? (
                <img
                  src={rev.user.avatar}
                  alt={rev.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-neutral-600" />
              )}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  {rev.user?.name || 'Anonymous Guest'}
                </h4>
                <p className="text-xs text-neutral-500">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SentimentBadge category={rev.sentimentCategory} score={rev.sentimentScore} />
              <div className="flex text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < rev.rating ? 'fill-amber-400' : 'text-neutral-700'}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed mb-3">{rev.comment}</p>

          {/* AI Extracted Topics */}
          {rev.topics && rev.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-800/60">
              <span className="text-xs text-neutral-500 mr-1">AI Topics:</span>
              {rev.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-800 text-neutral-400 border border-neutral-700/50"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
