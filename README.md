# CineBook - Movie Ticket Booking System

A full-stack movie ticket booking application similar to BookMyShow, built with React, Node.js, Express, and MongoDB.

## Features

- **Homepage**: Browse currently showing movies with posters, ratings, and genres
- **Movie Details**: View detailed movie information with showtimes and available seats
- **Seat Selection**: Interactive seat selection with real-time availability
- **User Authentication**: Sign up, sign in, and logout functionality
- **Booking History**: View past bookings for signed-in users
- **Admin Panel**: Add movies and showtimes (admin users only)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI) for UI components
- React Router for routing
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newportfolio
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movietickets
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

2. **Frontend Environment Variables** (Optional)
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Database Setup

1. **Start MongoDB** (if using local installation)

2. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

   This will create:
   - Sample movies with showtimes
   - Admin user: `admin@cinebook.com` / `admin123`
   - Test user: `user@cinebook.com` / `user123`

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open at http://localhost:3000

## Project Structure

```
newportfolio/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── scripts/          # Database seeding scripts
│   ├── server.js         # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context for state management
│   │   ├── services/     # API service functions
│   │   └── App.tsx       # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all active movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/:id/showtimes` - Get showtimes for a movie

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID

### Admin
- `POST /api/admin/movies` - Add new movie (admin only)
- `PUT /api/admin/movies/:id` - Update movie (admin only)
- `DELETE /api/admin/movies/:id` - Deactivate movie (admin only)
- `POST /api/admin/showtimes` - Add new showtime (admin only)

## Features Implemented

- ✅ Movie listing with search and filters
- ✅ User authentication and authorization
- ✅ Movie detail pages with showtimes
- ✅ Seat selection and booking flow
- ✅ Booking history
- ✅ Admin panel for content management
- ✅ Responsive design
- ✅ Real-time seat availability

## Future Enhancements

- Payment integration
- Email notifications
- Advanced search and filtering
- Movie reviews and ratings
- Theater management
- Revenue analytics for admin
- Mobile app

## Demo Credentials

### Admin Account
- Email: `admin@cinebook.com`
- Password: `admin123`

### User Account
- Email: `user@cinebook.com`  
- Password: `user123`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.