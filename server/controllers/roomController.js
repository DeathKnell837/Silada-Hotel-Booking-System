import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// @desc    Get all rooms with filters
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, checkIn, checkOut, search } = req.query;

    let filter = {};

    if (type && type !== 'all') filter.type = type;
    if (capacity) filter.capacity = { $gte: Number(capacity) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let rooms = await Room.find(filter).sort({ createdAt: -1 });

    // Check availability against existing bookings
    if (checkIn && checkOut) {
      const bookedRoomIds = await Booking.find({
        status: { $nin: ['cancelled'] },
        $or: [
          { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
        ],
      }).distinct('room');

      rooms = rooms.filter(
        (room) => !bookedRoomIds.some((id) => id.toString() === room._id.toString())
      );
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured rooms
// @route   GET /api/rooms/featured
// @access  Public
export const getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isFeatured: true }).limit(6);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Admin
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (room) {
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
