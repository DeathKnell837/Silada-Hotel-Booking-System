import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaSmile, FaChartLine, FaShieldAlt, FaComments } from 'react-icons/fa';
import { reviewService, pricingService, anomalyService, chatbotService } from '../../services/dataService';

const AdminAIPage = () => {
  const [sentimentData, setSentimentData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState([]);
  const [aiEngineStatus, setAiEngineStatus] = useState({ provider: 'Groq', model: 'openai/gpt-oss-120b', status: 'online' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const [sentRes, priceRes, anomalyRes, statusRes] = await Promise.all([
          reviewService.getInsights().catch(() => ({ data: null })),
          pricingService.getForecast().catch(() => ({ data: [] })),
          anomalyService.getAlerts().catch(() => ({ data: [] })),
          chatbotService.getStatus().catch(() => ({ data: null })),
        ]);

        setSentimentData(sentRes.data);
        setForecastData(priceRes.data || []);
        setAnomalyAlerts(anomalyRes.data || []);
        if (statusRes.data?.provider) {
          setAiEngineStatus(statusRes.data);
        }
      } catch (err) {
        console.error('Error loading AI dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
  }, []);

  const pendingAnomalies = anomalyAlerts.filter((a) => a.status === 'pending');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <FaRobot className="text-amber-400" /> Admin Control Panel
            </div>
            <h1 className="text-3xl font-serif font-bold text-neutral-100">Silada AI Intelligence Hub</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Real-time insights across Sentiment Analysis, Dynamic Pricing, Anomaly Security, and Conversational AI
            </p>
          </div>
        </div>

        {/* AI Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sentiment Stat */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Review Sentiment</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FaSmile className="text-lg" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-emerald-400">
              {sentimentData?.averageSentimentScore ?? 0.85} <span className="text-sm font-sans font-normal text-neutral-500">/ 1.0</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Based on {sentimentData?.totalReviews ?? 0} analyzed guest reviews
            </p>
            <Link
              to="/admin/ai/sentiment"
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View Sentiment Analytics &rarr;
            </Link>
          </div>

          {/* Pricing Stat */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Dynamic Pricing</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FaChartLine className="text-lg" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-amber-400">
              4 Active <span className="text-sm font-sans font-normal text-neutral-500">Rules</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">Demand & Weekend surge multipliers enabled</p>
            <Link
              to="/admin/ai/pricing"
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Configure Pricing Rules &rarr;
            </Link>
          </div>

          {/* Anomaly Stat */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Security Anomalies</span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <FaShieldAlt className="text-lg" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-rose-400">
              {pendingAnomalies.length} <span className="text-sm font-sans font-normal text-neutral-500">Pending</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              {anomalyAlerts.length} total flagged risk reservations
            </p>
            <Link
              to="/admin/ai/anomalies"
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Inspect Flagged Bookings &rarr;
            </Link>
          </div>

          {/* Chatbot Stat */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Concierge</span>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FaComments className="text-lg" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-sky-400">
              {aiEngineStatus.provider}
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono truncate" title={aiEngineStatus.model}>
              {aiEngineStatus.model}
            </p>
            <span className={`mt-3 text-xs font-semibold flex items-center gap-1 ${aiEngineStatus.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
              ● Engine {aiEngineStatus.status === 'online' ? 'Online' : 'Local Fallback'}
            </span>
          </div>
        </div>

        {/* Modules Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/40 transition">
            <h3 className="font-serif font-bold text-lg text-amber-100 mb-2">💬 Sentiment Intelligence</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Automated review scoring, topic extraction, and actionable management recommendations from guest reviews.
            </p>
            <Link
              to="/admin/ai/sentiment"
              className="inline-block px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-semibold text-xs rounded-xl transition border border-amber-500/30"
            >
              Open Sentiment Dashboard
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/40 transition">
            <h3 className="font-serif font-bold text-lg text-amber-100 mb-2">💰 Dynamic Pricing Engine</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Real-time occupancy forecasting and automated room price surge & discount controls.
            </p>
            <Link
              to="/admin/ai/pricing"
              className="inline-block px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-semibold text-xs rounded-xl transition border border-amber-500/30"
            >
              Open Pricing Config
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/40 transition">
            <h3 className="font-serif font-bold text-lg text-amber-100 mb-2">🛡️ Anomaly Security</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Rule-based and statistical risk detection for flagging unusual reservation amounts and rapid sequential bookings.
            </p>
            <Link
              to="/admin/ai/anomalies"
              className="inline-block px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-semibold text-xs rounded-xl transition border border-amber-500/30"
            >
              Review Security Alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIPage;
