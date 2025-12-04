import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

interface Booking {
  _id: string;
  movie: {
    title: string;
    poster: string;
  };
  showtime: {
    date: string;
    time: string;
    theater: {
      name: string;
      location: string;
    };
    price: number;
  };
  seats: {
    seatNumber: string;
    row: string;
  }[];
  totalAmount: number;
  status: string;
  bookingId: string;
  createdAt: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await bookingService.getUserBookings();
        setBookings(bookingsData);
      } catch (error: any) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Book your first movie ticket to see it here!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {bookings.map((booking) => (
            <Box key={booking._id} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {booking.movie.title}
                    </Typography>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Booking ID:</strong> {booking.bookingId}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Theater:</strong> {booking.showtime.theater.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Location:</strong> {booking.showtime.theater.location}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Date & Time:</strong>{' '}
                    {new Date(booking.showtime.date).toLocaleDateString()} at {booking.showtime.time}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Seats:</strong>
                  </Typography>
                  <Box mb={2}>
                    {booking.seats.map((seat, index) => (
                      <Chip
                        key={index}
                        label={seat.seatNumber}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" color="primary">
                    Total: ₹{booking.totalAmount}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Bookings;