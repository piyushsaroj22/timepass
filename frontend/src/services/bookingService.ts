import api from './api';

export const bookingService = {
  createBooking: async (bookingData: {
    movieId: string;
    showtimeId: string;
    seats: { seatNumber: string; row: string }[];
  }) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  }
};