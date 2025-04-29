import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Box, Typography } from '@mui/material';
import { getAllMovies } from '../../utils/API';
import MovieItem from './MovieItem';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  premium: boolean;
  main_lead: string;
  streaming_platform: string;
  poster_url: string;
  banner_url: string;
}


interface Episode {
  id: number;
  title: string;
  image: string;
  starRating: number;
  year: number;
  duration: string;
  date: string;
  desc: string;
  director: string;
  main_lead: string;
  streaming_platform: string;
}

const GetMovies = () => {
  const [movies, setMovies] = useState<Episode[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await getAllMovies();
        console.log('API Response:', response);

        const movieData = response?.movies || [];
        console.log('Movie Data:', movieData);

        if (Array.isArray(movieData) && movieData.length > 0) {
          const mappingMovie: Episode[] = movieData.map((movie: Movie) => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_url,
            starRating: movie.rating,
            year: movie.release_year,
            duration: `${movie.duration} min`,
            date: new Date().toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
            }),
            desc: movie.description,
            director: movie.director,
            main_lead: movie.main_lead,
            streaming_platform: movie.streaming_platform,
          }));
          setMovies(mappingMovie);
          console.log('Mapped Movies:', mappingMovie);
        } else {
          console.log('No movies found in response or movieData is not an array');
        }
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };
    loadMovies();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#000',
      }}
    >
      <Header role="user" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(6, 1fr)', 
          },
          gap: 2,
          p: 2,
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        {movies.length > 0 ? (
          movies.map((item, index) => (
            <MovieItem key={item.id} episode={item} index={index} />
          ))
        ) : (
          <Typography color="white" sx={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No movies available
          </Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default GetMovies;