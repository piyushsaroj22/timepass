const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  availableSeats: {
    type: Number,
    default: 100
  },
  bookedSeats: [{
    seatNumber: String,
    row: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Showtime', showtimeSchema);