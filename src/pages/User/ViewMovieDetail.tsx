// import React from "react";
// import { Box } from "@mui/material";
// import Header from "../../components/common/Header";
// import Footer from "../../components/common/Footer";
// import { MoviesDetail } from "../../components/movieDetail.tsx/MovieDetail";
// import { topRated, hollywood, bollywood } from "../../../config/MoviesData";
// import Carousel from "../../components/moviesLayout/Carousel";

// const ViewMovieDetail: React.FC = () => {
//   const carousels = [
//       {
//         title: "Top Rated",
//         items: topRated,
//       },
//     ];

//   return (
//     <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
//       <Header role="user" />
//       <MoviesDetail />
//       {carousels.map((carousel, index) => (
//               <Carousel key={index} title={carousel.title} items={carousel.items} />
//             ))}
//       <Footer />
//     </Box>
//   );
// };

// export default ViewMovieDetail;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box , Typography} from '@mui/material';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MoviesDetail from '../../components/movieDetail/MovieDetail';
import Carousel from '../../components/moviesLayout/Carousel';
import { getMoviesById } from '../../utils/API';

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

const ViewMovieDetail: React.FC = () => {
  const [movieGenre, setMovieGenre] = useState<string>('Action'); // Default genre
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    const fetchMovieGenre = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching movie with ID: ${id} for genre`);
        const movieData = await getMoviesById(Number(id));
        if (movieData && movieData.genre) {
          // Use the first genre if multiple are listed
          setMovieGenre(movieData.genre.split(',')[0].trim());
        }
      } catch (err: any) {
        console.error('Error fetching movie genre:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieGenre();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Header role="user" />
      <MoviesDetail />
      <Carousel title="Related Movies" genre={movieGenre} />
      <Footer />
    </Box>
  );
};

export default ViewMovieDetail;