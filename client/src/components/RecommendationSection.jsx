import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaStar, FaUsers, FaBed } from 'react-icons/fa';
import { recommendationService } from '../services/dataService';

const RecommendationSection = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await recommendationService.getRecommendations();
        setRecommendations(res.data || []);
      } catch (err) {
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading || !recommendations || recommendations.length === 0) return null;

  return (
    <section className="py-12 bg-neutral-950/60 border-y border-neutral-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <FaRobot className="text-amber-400" /> AI Powered Engine
            </div>
            <h2 className="text-3xl font-serif font-bold text-neutral-100">Recommended For You</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Handpicked luxury rooms matched to your booking history and guest preferences
            </p>
          </div>
          <Link
            to="/rooms"
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1 transition"
          >
            Explore All Rooms &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((room) => (
            <div
              key={room._id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-400 flex items-center gap-1">
                    <FaRobot className="text-amber-400" /> {room.aiScore || 95}% Match
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                      {room.recommendationReason || 'Popular Choice'}
                    </span>
                    <h3 className="font-serif font-bold text-neutral-100 group-hover:text-amber-400 transition text-base">
                      {room.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaUsers className="text-neutral-500" /> {room.capacity} Guests
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBed className="text-neutral-500" /> {room.bedType}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 ml-auto">
                      <FaStar className="fill-amber-400" /> {room.rating || 4.5}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-neutral-800/40 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xs text-neutral-500 block">Per Night</span>
                  <span className="text-lg font-bold text-amber-400 font-serif">
                    ₱{room.price?.toLocaleString()}
                  </span>
                </div>
                <Link
                  to={`/rooms/${room._id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-semibold text-xs transition border border-amber-500/30"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
