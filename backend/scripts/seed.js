const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movietickets');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleMovies = [
  {
    title: "Avengers: Endgame",
    description: "The grave course of events set in motion by Thanos that wiped out half the universe and fractured the Avengers ranks compels the remaining Avengers to take one final stand in Marvel Studios' grand conclusion to twenty-two films.",
    genre: ["Action", "Adventure", "Drama"],
    duration: 181,
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    releaseDate: new Date("2019-04-26"),
    language: "English",
    director: "Anthony Russo, Joe Russo",
    cast: [
      { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
      { name: "Chris Evans", role: "Steve Rogers / Captain America" },
      { name: "Mark Ruffalo", role: "Bruce Banner / Hulk" },
      { name: "Chris Hemsworth", role: "Thor" },
      { name: "Scarlett Johansson", role: "Natasha Romanoff / Black Widow" }
    ]
  },
  {
    title: "Spider-Man: No Way Home",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 148,
    rating: 8.2,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    releaseDate: new Date("2021-12-17"),
    language: "English",
    director: "Jon Watts",
    cast: [
      { name: "Tom Holland", role: "Peter Parker / Spider-Man" },
      { name: "Zendaya", role: "MJ" },
      { name: "Benedict Cumberbatch", role: "Doctor Strange" },
      { name: "Jacob Batalon", role: "Ned Leeds" }
    ]
  },
  {
    title: "The Batman",
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    genre: ["Action", "Crime", "Drama"],
    duration: 176,
    rating: 7.8,
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    releaseDate: new Date("2022-03-04"),
    language: "English",
    director: "Matt Reeves",
    cast: [
      { name: "Robert Pattinson", role: "Bruce Wayne / Batman" },
      { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman" },
      { name: "Paul Dano", role: "The Riddler" },
      { name: "Jeffrey Wright", role: "James Gordon" }
    ]
  },
  {
    title: "Top Gun: Maverick",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    genre: ["Action", "Drama"],
    duration: 130,
    rating: 8.3,
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    releaseDate: new Date("2022-05-27"),
    language: "English",
    director: "Joseph Kosinski",
    cast: [
      { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell" },
      { name: "Miles Teller", role: "Bradley 'Rooster' Bradshaw" },
      { name: "Jennifer Connelly", role: "Penny Benjamin" },
      { name: "Jon Hamm", role: "Cyclone" }
    ]
  },
  {
    title: "Black Panther: Wakanda Forever",
    description: "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    genre: ["Action", "Adventure", "Drama"],
    duration: 161,
    rating: 6.7,
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    releaseDate: new Date("2022-11-11"),
    language: "English",
    director: "Ryan Coogler",
    cast: [
      { name: "Letitia Wright", role: "Shuri" },
      { name: "Angela Bassett", role: "Queen Ramonda" },
      { name: "Tenoch Huerta", role: "Namor" },
      { name: "Danai Gurira", role: "Okoye" }
    ]
  }
];

const theaters = [
  { name: "PVR Cinemas", location: "Phoenix MarketCity, Mumbai" },
  { name: "INOX Leisure", location: "Forum Mall, Bangalore" },
  { name: "Cinepolis", location: "DLF Mall, Delhi" },
  { name: "Carnival Cinemas", location: "City Center, Pune" },
  { name: "Big Cinemas", location: "Express Avenue, Chennai" }
];

const timeSlots = ["09:00", "12:30", "16:00", "19:30", "22:00"];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@cinebook.com',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create sample user
    const userHashedPassword = await bcrypt.hash('user123', 12);
    const sampleUser = new User({
      name: 'John Doe',
      email: 'user@cinebook.com',
      password: userHashedPassword,
      role: 'user'
    });
    await sampleUser.save();
    console.log('Sample user created');

    // Insert movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log('Sample movies inserted');

    // Generate showtimes for each movie
    const showtimes = [];
    
    for (const movie of insertedMovies) {
      // Generate showtimes for the next 7 days
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        
        // Random number of theaters (1-3) per day per movie
        const numberOfTheaters = Math.floor(Math.random() * 3) + 1;
        const shuffledTheaters = theaters.sort(() => 0.5 - Math.random()).slice(0, numberOfTheaters);
        
        for (const theater of shuffledTheaters) {
          // Random number of showtimes (2-4) per theater per day
          const numberOfShows = Math.floor(Math.random() * 3) + 2;
          const shuffledTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, numberOfShows);
          
          for (const time of shuffledTimes) {
            showtimes.push({
              movie: movie._id,
              theater: {
                name: theater.name,
                location: theater.location
              },
              date: date,
              time: time,
              price: Math.floor(Math.random() * 200) + 150, // Random price between 150-350
              totalSeats: 100,
              availableSeats: 100,
              bookedSeats: []
            });
          }
        }
      }
    }

    await Showtime.insertMany(showtimes);
    console.log('Sample showtimes inserted');

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@cinebook.com / admin123');
    console.log('User: user@cinebook.com / user123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(seedDatabase);