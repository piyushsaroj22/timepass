import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { bookingService } from '../services/bookingService';

interface Seat {
  seatNumber: string;
  row: string;
  isBooked: boolean;
}

const SeatSelection: React.FC = () => {
  const { movieId, showtimeId } = useParams<{ movieId: string; showtimeId: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<any>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId || !showtimeId) return;
      
      try {
        const [movieData, showtimesData] = await Promise.all([
          movieService.getMovieById(movieId),
          movieService.getMovieShowtimes(movieId)
        ]);
        
        setMovie(movieData);
        const currentShowtime = showtimesData.find((s: any) => s._id === showtimeId);
        setShowtime(currentShowtime);
        
        // Generate seat layout (simple 10x10 grid for demo)
        const seatLayout: Seat[] = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        rows.forEach(row => {
          for (let i = 1; i <= 10; i++) {
            const seatNumber = `${row}${i}`;
            const isBooked = currentShowtime?.bookedSeats?.some((bookedSeat: any) => 
              bookedSeat.seatNumber === seatNumber
            ) || false;
            
            seatLayout.push({
              seatNumber,
              row,
              isBooked
            });
          }
        });
        
        setSeats(seatLayout);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, showtimeId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    
    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length < 6) { // Max 6 seats
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBooking(true);
    setError('');

    try {
      const bookingData = {
        movieId: movieId!,
        showtimeId: showtimeId!,
        seats: selectedSeats.map(seat => ({
          seatNumber: seat.seatNumber,
          row: seat.row
        }))
      };

      await bookingService.createBooking(bookingData);
      navigate('/bookings');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked) return '#ccc';
    if (selectedSeats.some(s => s.seatNumber === seat.seatNumber)) return '#d32f2f';
    return '#4caf50';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie || !showtime) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Booking information not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="body1">
          {showtime.theater.name}, {showtime.theater.location}
        </Typography>
        <Typography variant="body1">
          {new Date(showtime.date).toLocaleDateString()} at {showtime.time}
        </Typography>
        <Typography variant="h6" color="primary">
          ₹{showtime.price} per seat
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Select Your Seats
            </Typography>
            
            <Box display="flex" justifyContent="center" mb={2}>
              <Box
                sx={{
                  width: '60%',
                  height: 20,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  SCREEN
                </Typography>
              </Box>
            </Box>

            <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                <Box key={row} display="flex" justifyContent="center" mb={1} alignItems="center">
                  <Typography variant="body2" sx={{ mr: 1, minWidth: 20 }}>
                    {row}
                  </Typography>
                  {seats
                    .filter(seat => seat.row === row)
                    .map(seat => (
                      <Button
                        key={seat.seatNumber}
                        variant="contained"
                        size="small"
                        sx={{
                          minWidth: 30,
                          height: 30,
                          m: 0.25,
                          backgroundColor: getSeatColor(seat),
                          '&:hover': {
                            backgroundColor: seat.isBooked ? '#ccc' : getSeatColor(seat),
                          },
                          fontSize: '10px'
                        }}
                        disabled={seat.isBooked}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat.seatNumber.slice(-1)}
                      </Button>
                    ))}
                </Box>
              ))}
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={3}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, backgroundColor: '#4caf50', mr: 1 }} />
                <Typography variant="body2">Available</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, backgroundColor: '#d32f2f', mr: 1 }} />
                <Typography variant="body2">Selected</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, backgroundColor: '#ccc', mr: 1 }} />
                <Typography variant="body2">Booked</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              Selected Seats: {selectedSeats.length}
            </Typography>
            
            {selectedSeats.length > 0 && (
              <Box mb={2}>
                {selectedSeats.map(seat => (
                  <Chip
                    key={seat.seatNumber}
                    label={seat.seatNumber}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>
              Total: ₹{selectedSeats.length * showtime.price}
            </Typography>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
              sx={{ mt: 2 }}
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default SeatSelection;