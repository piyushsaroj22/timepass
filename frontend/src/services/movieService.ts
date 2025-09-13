import api from './api';

export const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  getMovieById: async (id: string) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getMovieShowtimes: async (movieId: string, date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get(`/movies/${movieId}/showtimes`, { params });
    return response.data;
  }
};