import React, { useEffect, useState } from 'react';
import { FaSmile, FaFrown, FaMeh, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { reviewService } from '../../services/dataService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminSentiment = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await reviewService.getInsights();
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-32 text-center text-neutral-400">
        Loading AI Sentiment Insights...
      </div>
    );
  }

  const categoryCounts = insights?.categoryCounts || { Positive: 0, Neutral: 0, Negative: 0 };
  const doughnutData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [categoryCounts.Positive || 0, categoryCounts.Neutral || 0, categoryCounts.Negative || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderColor: '#0a0a0a',
        borderWidth: 2,
      },
    ],
  };

  const topicLabels = Object.keys(insights?.topicBreakdown || {});
  const topicValues = Object.values(insights?.topicBreakdown || {});

  const barData = {
    labels: topicLabels.length ? topicLabels : ['Cleanliness', 'Service', 'WiFi', 'Amenities'],
    datasets: [
      {
        label: 'Mentions in Reviews',
        data: topicValues.length ? topicValues : [5, 3, 2, 4],
        backgroundColor: '#f59e0b',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-100">AI Sentiment Intelligence</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automated guest review sentiment analysis, topic extraction, and actionable management items
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Total Reviews</span>
            <div className="text-3xl font-bold font-serif text-neutral-100 mt-2">
              {insights?.totalReviews || 0}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Avg Sentiment Score</span>
            <div className="text-3xl font-bold font-serif text-emerald-400 mt-2">
              {insights?.averageSentimentScore || 0.0}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Positive Reviews</span>
            <div className="text-3xl font-bold font-serif text-emerald-400 mt-2 flex items-center gap-2">
              <FaSmile className="text-2xl" /> {categoryCounts.Positive || 0}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Action Items Flagged</span>
            <div className="text-3xl font-bold font-serif text-amber-400 mt-2 flex items-center gap-2">
              <FaLightbulb className="text-2xl" /> {insights?.actionableSuggestions?.length || 0}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doughnut Chart */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-serif font-bold text-neutral-200 mb-4">Sentiment Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-serif font-bold text-neutral-200 mb-4">Extracted Review Topics</h3>
            <div className="h-64">
              <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </div>
        </div>

        {/* Actionable Suggestions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FaLightbulb className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-100">AI Actionable Improvement Recommendations</h3>
              <p className="text-xs text-neutral-400">Extracted automatically from negative & neutral guest feedback</p>
            </div>
          </div>

          {insights?.actionableSuggestions?.length > 0 ? (
            <div className="space-y-3">
              {insights.actionableSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-amber-400 text-base mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">{item.suggestion}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Room: {item.roomName} • Rating: {item.rating}/5 ⭐
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
                    Action Needed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No negative items flagged. Guests are satisfied!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSentiment;
