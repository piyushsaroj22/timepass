import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { useAuth } from '../context/AuthContext';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  poster: string;
  releaseDate: string;
  language: string;
  director: string;
  cast: { name: string; role: string }[];
}

interface Showtime {
  _id: string;
  date: string;
  time: string;
  theater: {
    name: string;
    location: string;
  };
  price: number;
  availableSeats: number;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        const [movieData, showtimesData] = await Promise.all([
          movieService.getMovieById(id),
          movieService.getMovieShowtimes(id)
        ]);
        
        setMovie(movieData);
        setShowtimes(showtimesData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleBooking = (showtimeId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}/${showtimeId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Movie not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: '0 0 300px' }}>
          <img
            src={movie.poster || 'https://via.placeholder.com/300x400?text=Movie+Poster'}
            alt={movie.title}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {movie.title}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={movie.rating / 2} precision={0.1} size="large" readOnly />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {movie.rating}/10
            </Typography>
          </Box>

          <Box mb={2}>
            {movie.genre.map((g) => (
              <Chip
                key={g}
                label={g}
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            <strong>Duration:</strong> {movie.duration} minutes
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Language:</strong> {movie.language}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Director:</strong> {movie.director}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            About the Movie
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>

          {movie.cast && movie.cast.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Box mb={2}>
                {movie.cast.slice(0, 5).map((actor, index) => (
                  <Chip
                    key={index}
                    label={`${actor.name} as ${actor.role}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Showtimes
        </Typography>
        
        {showtimes.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No showtimes available for this movie
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {showtimes.map((showtime) => (
              <Box key={showtime._id} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {showtime.theater.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {showtime.theater.location}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(showtime.date)} at {showtime.time}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ₹{showtime.price}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {showtime.availableSeats} seats available
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleBooking(showtime._id)}
                      disabled={showtime.availableSeats === 0}
                      sx={{ mt: 1 }}
                    >
                      {showtime.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MovieDetail;