import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';

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
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await movieService.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Now Showing
      </Typography>
      
      {movies.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No movies currently showing
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {movies.map((movie) => (
            <Box key={movie._id} sx={{ flex: '0 1 280px', maxWidth: '300px' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster || 'https://via.placeholder.com/300x400?text=Movie+Poster'}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {movie.title}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating value={movie.rating / 2} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {movie.rating}/10
                    </Typography>
                  </Box>

                  <Box mb={1}>
                    {movie.genre.slice(0, 2).map((g) => (
                      <Chip
                        key={g}
                        label={g}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {movie.duration} mins • {movie.language}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {movie.description}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/movie/${movie._id}`}
                    sx={{ backgroundColor: '#d32f2f' }}
                  >
                    Book Tickets
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;