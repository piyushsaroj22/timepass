import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    poster: '',
    releaseDate: '',
    language: '',
    director: '',
  });
  const [showtimeFormData, setShowtimeFormData] = useState({
    movieId: '',
    theaterName: '',
    theaterLocation: '',
    date: '',
    time: '',
    price: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSuccessMessage('');
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Movie added successfully! (This is a demo - backend integration needed)');
    setMovieFormData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      rating: '',
      poster: '',
      releaseDate: '',
      language: '',
      director: '',
    });
  };

  const handleShowtimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Showtime added successfully! (This is a demo - backend integration needed)');
    setShowtimeFormData({
      movieId: '',
      theaterName: '',
      theaterLocation: '',
      date: '',
      time: '',
      price: '',
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. This page is only accessible to administrators.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Add Movie" />
          <Tab label="Add Showtime" />
          <Tab label="Manage Bookings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Add New Movie
          </Typography>
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleMovieSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={movieFormData.title}
                  onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Director"
                  value={movieFormData.director}
                  onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                  required
                />
              </Box>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={movieFormData.description}
                onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Genre (comma separated)"
                  value={movieFormData.genre}
                  onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                  placeholder="Action, Drama, Comedy"
                  required
                />
                <TextField
                  fullWidth
                  label="Language"
                  value={movieFormData.language}
                  onChange={(e) => setMovieFormData({ ...movieFormData, language: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={movieFormData.duration}
                  onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Rating (0-10)"
                  type="number"
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  value={movieFormData.rating}
                  onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Release Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={movieFormData.releaseDate}
                  onChange={(e) => setMovieFormData({ ...movieFormData, releaseDate: e.target.value })}
                  required
                />
              </Box>
              <TextField
                fullWidth
                label="Poster URL"
                value={movieFormData.poster}
                onChange={(e) => setMovieFormData({ ...movieFormData, poster: e.target.value })}
                required
              />
              <Button type="submit" variant="contained" size="large">
                Add Movie
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Add New Showtime
          </Typography>
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleShowtimeSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Movie ID"
                value={showtimeFormData.movieId}
                onChange={(e) => setShowtimeFormData({ ...showtimeFormData, movieId: e.target.value })}
                required
                helperText="Enter the movie ID from the database"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Theater Name"
                  value={showtimeFormData.theaterName}
                  onChange={(e) => setShowtimeFormData({ ...showtimeFormData, theaterName: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Theater Location"
                  value={showtimeFormData.theaterLocation}
                  onChange={(e) => setShowtimeFormData({ ...showtimeFormData, theaterLocation: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={showtimeFormData.date}
                  onChange={(e) => setShowtimeFormData({ ...showtimeFormData, date: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={showtimeFormData.time}
                  onChange={(e) => setShowtimeFormData({ ...showtimeFormData, time: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={showtimeFormData.price}
                  onChange={(e) => setShowtimeFormData({ ...showtimeFormData, price: e.target.value })}
                  required
                />
              </Box>
              <Button type="submit" variant="contained" size="large">
                Add Showtime
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Manage Bookings
          </Typography>
          <Alert severity="info">
            Booking management features will be implemented here. This would include viewing all bookings, 
            updating booking status, and generating reports.
          </Alert>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Admin;