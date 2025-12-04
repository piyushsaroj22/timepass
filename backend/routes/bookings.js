const express = require('express');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, showtimeId, seats } = req.body;

    // Check if showtime exists and has available seats
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if seats are available
    const bookedSeatNumbers = showtime.bookedSeats.map(seat => seat.seatNumber);
    const requestedSeats = seats.map(seat => seat.seatNumber);
    const unavailableSeats = requestedSeats.filter(seat => bookedSeatNumbers.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        unavailableSeats 
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * showtime.price;

    // Generate booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      movie: movieId,
      showtime: showtimeId,
      seats,
      totalAmount,
      bookingId,
      status: 'confirmed'
    });

    await booking.save();

    // Update showtime with booked seats
    showtime.bookedSeats.push(...seats);
    showtime.availableSeats -= seats.length;
    await showtime.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster')
      .populate('showtime', 'date time theater price');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster')
      .populate('showtime', 'date time theater price')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('movie', 'title poster')
    .populate('showtime', 'date time theater price');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;