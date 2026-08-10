import PricingConfig from '../models/PricingConfig.js';
import { calculateDynamicPrice, getDemandForecast } from '../services/pricingService.js';

export const getPriceQuote = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkIn, checkOut } = req.query;

    const quote = await calculateDynamicPrice(roomId, checkIn, checkOut);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForecast = async (req, res) => {
  try {
    const forecast = await getDemandForecast();
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPricingConfig = async (req, res) => {
  try {
    const configs = await PricingConfig.find();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePricingConfig = async (req, res) => {
  try {
    const { roomType } = req.params;
    const updateData = req.body;

    let config = await PricingConfig.findOne({ roomType });
    if (!config) {
      config = new PricingConfig({ roomType, ...updateData });
    } else {
      Object.assign(config, updateData);
    }

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
