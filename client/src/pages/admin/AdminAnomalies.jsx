import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';
import { anomalyService } from '../../services/dataService';
import toast from 'react-hot-toast';

const AdminAnomalies = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await anomalyService.getAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await anomalyService.updateStatus(id, status);
      toast.success(`Booking risk status updated to ${status}`);
      fetchAlerts();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-100">Payment Security & Anomaly Detection</h1>
          <p className="text-sm text-neutral-400 mt-1">
            AI-flagged suspicious reservations, rapid booking patterns, and high-value transaction risk scores
          </p>
        </div>

        {/* Alerts List */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <h3 className="font-serif font-bold text-lg text-neutral-100 flex items-center gap-2">
              <FaShieldAlt className="text-rose-400" /> Flagged Reservation Security Alerts
            </h3>
            <span className="text-xs text-neutral-400">Total Alerts: {alerts.length}</span>
          </div>

          {alerts.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <FaCheck className="text-3xl text-emerald-500 mx-auto mb-2 opacity-80" />
              <p>No security anomalies detected. All bookings are within standard parameters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alert.riskLevel === 'Critical' || alert.riskLevel === 'High'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        Risk Level: {alert.riskLevel} ({alert.riskScore}/100)
                      </span>
                      <span className="text-xs text-neutral-400">
                        Status: <strong className="uppercase">{alert.status}</strong>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-neutral-200">
                        User: {alert.user?.name} ({alert.user?.email})
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Room: {alert.booking?.room?.name || 'Hotel Room'} • Total: ₱
                        {alert.booking?.totalPrice?.toLocaleString()}
                      </p>
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {alert.flags.map((flag, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-0.5 rounded text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1"
                        >
                          <FaExclamationTriangle className="text-[10px]" /> {flag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-2 md:pt-0">
                      <button
                        onClick={() => handleUpdateStatus(alert._id, 'approved')}
                        className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-semibold text-xs rounded-xl border border-emerald-500/30 transition flex items-center gap-1.5"
                      >
                        <FaCheck /> Approve Booking
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(alert._id, 'rejected')}
                        className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-semibold text-xs rounded-xl border border-rose-500/30 transition flex items-center gap-1.5"
                      >
                        <FaTimes /> Reject / Flag Fraud
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnomalies;
