// import React, { useState, useEffect } from 'react';
// import { Box, Typography } from '@mui/material';
// import Header from '../../components/common/Header';
// import Footer from '../../components/common/Footer';
// import Carousel from '../../components/moviesLayout/Carousel';
// import BigSlider from '../../components/moviesLayout/BigSlider';
// import { Episode } from '../../../config/MoviesData';
// import { getAllMovies } from '../../utils/API';

// interface Movie {
//   id: number;
//   title: string;
//   genre: string;
//   release_year: number;
//   rating: number;
//   director: string;
//   duration: number;
//   description: string;
//   premium: boolean;
//   main_lead: string;
//   streaming_platform: string;
//   poster_url: string;
//   banner_url: string;
// }

// interface MoviesResponse {
//   movies: Movie[];
//   pagination: {
//     current_page: number;
//     total_pages: number;
//     total_count: number;
//     per_page: number;
//   };
// }

// const UserDashboard = () => {
//   const [topRatedMovies, setTopRatedMovies] = useState<Episode[]>([]);
//   const [carousels, setCarousels] = useState<{ title: string; genre: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTopRatedMovies = async () => {
//       try {
//         console.log('Fetching movies...');
//         const movieData = await getAllMovies();
//         console.log('Raw API response:', movieData);

//         const movieArray = movieData || [];
//         if (Array.isArray(movieArray) && movieArray.length > 0) {
//           const uniqueGenres = Array.from(new Set(movieArray.map((movie) => movie.genre)))
//             .map((genre) => ({
//               title: genre,
//               genre,
//             }));
//           console.log('Dynamic carousels:', uniqueGenres);
//           setCarousels(uniqueGenres);

//           // Map top-rated movies
//           const formattedMovies: Episode[] = movieArray
//             .filter((movie) => movie.rating >= 3) // Filter for top-rated (adjust as needed)
//             .map((movie: Movie) => ({
//               id: movie.id,
//               title: movie.title || 'Untitled',
//               image: movie.banner_url ,
//               image2: movie.poster_url,
//               starRating: movie.rating || 0,
//               year: movie.release_year || 0,
//               duration: movie.duration
//                 ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
//                 : '0h 0m',
//               date: new Date().toISOString().split('T')[0],
//               desc: movie.description || 'No description available',
//               director: movie.director || 'Unknown',
//               main_lead: movie.main_lead || 'Unknown',
//               streaming_platform: movie.streaming_platform || 'Unknown',
//             }));
//           console.log('Mapped top-rated movies:', formattedMovies);
//           setTopRatedMovies(formattedMovies);
//         } else {
//           console.log('No movies found');
//           setError('No movies available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching movies:', err.message);
//         setError('Failed to load movies');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopRatedMovies();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3, minHeight: '100vh' }}>
//         <Typography>Loading dashboard...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ bgcolor: '#181818', color: '#fff', p: 3, minHeight: '100vh' }}>
//         <Typography>{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//       }}
//     >
//       <Header role="user" />
//       <BigSlider items={topRatedMovies} />
//       {carousels.map((carousel, index) => (
//         <Carousel key={index} title={carousel.title} genre={carousel.genre} />
//       ))}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//         }}
//       ></Box>
//       <Footer />
//     </Box>
//   );
// };

// export default UserDashboard;