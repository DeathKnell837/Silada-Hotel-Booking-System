import React, { useEffect, useState } from 'react';
import { FaChartLine, FaCheck, FaPercentage, FaExclamationTriangle } from 'react-icons/fa';
import { pricingService } from '../../services/dataService';
import toast from 'react-hot-toast';

const AdminPricing = () => {
  const [forecast, setForecast] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [foreRes, cfgRes] = await Promise.all([
        pricingService.getForecast(),
        pricingService.getConfig(),
      ]);
      setForecast(foreRes.data || []);
      setConfigs(cfgRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoPricing = async (type, currentStatus) => {
    try {
      await pricingService.updateConfig(type, { isAutoPricingEnabled: !currentStatus });
      toast.success(`Auto-pricing ${!currentStatus ? 'enabled' : 'disabled'} for ${type}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update pricing settings');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-100">Dynamic Pricing & Demand Forecast</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automated demand-based price adjustments, surge multipliers, and seasonal rate controls
          </p>
        </div>

        {/* Forecast Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-100">Live Room Demand & AI Dynamic Rates</h3>
              <p className="text-xs text-neutral-400">Current dynamic rates calculated from demand multipliers</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <FaChartLine /> Real-time Calculation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Base Rate</th>
                  <th className="px-6 py-4">AI Current Rate</th>
                  <th className="px-6 py-4">Multiplier</th>
                  <th className="px-6 py-4">Occupancy</th>
                  <th className="px-6 py-4">Demand Level</th>
                  <th className="px-6 py-4">Active Surge Factors</th>
                  <th className="px-6 py-4 text-right">Auto-Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {forecast.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-neutral-100">{item.roomType}</td>
                    <td className="px-6 py-4">₱{item.avgBasePrice?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-amber-400 font-serif">
                      ₱{item.currentDynamicPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-amber-300">
                        {item.currentMultiplier}x
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-neutral-800 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${item.projectedOccupancy}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-400">{item.projectedOccupancy}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.demandLevel === 'High'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.demandLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400">
                      {item.pricingFactors.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleAutoPricing(item.roomType, item.isAutoPricingEnabled)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                          item.isAutoPricingEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                        }`}
                      >
                        {item.isAutoPricingEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;
