import AnomalyAlert from '../models/AnomalyAlert.js';

export const getAnomalyAlerts = async (req, res) => {
  try {
    const alerts = await AnomalyAlert.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'booking',
        populate: { path: 'room', select: 'name type price' },
      })
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnomalyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await AnomalyAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Anomaly alert not found' });
    }

    alert.status = status || alert.status;
    alert.reviewedBy = req.user._id;
    alert.reviewedAt = Date.now();

    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
