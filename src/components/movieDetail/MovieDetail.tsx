// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Rating,
//   Chip,
//   Container,
//   Stack,
//   Avatar,
//   Divider,
// } from "@mui/material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import StarIcon from "@mui/icons-material/Star";
// import MovieFilterIcon from "@mui/icons-material/MovieFilter";
// import PersonIcon from "@mui/icons-material/Person";
// import TvIcon from "@mui/icons-material/Tv";
// import { Episode, topRated, hollywood, bollywood } from "../../../config/MoviesData";

// export const MoviesDetail = () => {
//   const { id } = useParams<{ id?: string }>();
//   const allEpisodes = [...topRated, ...hollywood, ...bollywood];
//   const episode = allEpisodes.find((ep) => ep.id === Number(id));

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   if (!episode) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
//         <Typography variant="h4">Episode not found</Typography>
//         <Button variant="contained" color="primary" href="/" sx={{ mt: 3 }}>
//           Return to Home
//         </Button>
//       </Container>
//     );
//   }

//   // Extract first sentence for short description
//   const shortDesc = episode.desc.split(".")[0] + ".";

//   return (
//     <Box sx={{ bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
//       {/* Hero Banner with Gradient Overlay */}
//       <Box
//         sx={{
//           position: "relative",
//           width: "100%",
//           height: { xs: 400, md: 500, lg: 600 },
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background:
//               "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.9) 90%)",
//             zIndex: 1,
//           }}
//         />
//         <img
//           src={episode.image}
//           alt={episode.title}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//           }}
//           loading="lazy"
//         />

//         {/* Content Overlay */}
//         <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
//           <Box
//             sx={{
//               position: "absolute",
//               bottom: { xs: 30, md: 60 },
//               width: "100%",
//               maxWidth: "lg",
//               pr: 4,
//             }}
//           >
//             <Typography
//               variant="h2"
//               fontWeight="bold"
//               sx={{
//                 textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
//                 fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
//               }}
//             >
//               {episode.title}
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mt: 2,
//                 flexWrap: "wrap",
//                 gap: 1,
//               }}
//             >
//               <Chip
//                 label={episode.year.toString()}
//                 size="medium"
//                 sx={{ bgcolor: "black", color: "white", mr: 1 }}
//                 icon={<CalendarTodayIcon fontSize="small" sx={{ color: "white" }} />}
//               />
//               <Chip
//                 label={episode.duration}
//                 size="medium"
//                 sx={{ bgcolor: "black", color: "#fff", mr: 1 }}
//                 icon={<AccessTimeIcon fontSize="small" />}
//               />
//               <Box sx={{ display: "flex", alignItems: "center", ml: { xs: 0, sm: 1 } }}>
//                 <StarIcon sx={{ color: "#FFCA28", mr: 0.5 }} />
//                 <Typography variant="body1" fontWeight="bold">
//                   {episode.starRating.toFixed(1)}
//                 </Typography>
//               </Box>
//             </Box>

//             <Typography
//               variant="subtitle1"
//               sx={{
//                 mt: 2,
//                 maxWidth: { sm: "80%", md: "60%" },
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 textShadow: "0 0 8px rgba(0, 0, 0, 0.7)",
//               }}
//             >
//               {shortDesc}
//             </Typography>

//             <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={<PlayArrowIcon />}
//                 sx={{
//                   bgcolor: "#E50914",
//                   color: "#fff",
//                   px: 4,
//                   "&:hover": { bgcolor: "#B20710" },
//                 }}
//               >
//                 Watch Now
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 sx={{
//                   borderColor: "#fff",
//                   color: "#fff",
//                   "&:hover": { borderColor: "#E50914", color: "#E50914" },
//                 }}
//               >
//                 Add to Watchlist
//               </Button>
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* Main Content */}
//       <Container maxWidth="lg" sx={{ py: 6 }}>
//         <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
//           {/* Left Column - Details Section */}
//           <Box
//             sx={{
//               width: { xs: "100%", md: "66.666%" },
//               pr: { xs: 0, md: 4 },
//               mb: { xs: 4, md: 0 },
//             }}
//           >
//             {/* Cast & Production Section with Flexbox */}
//             <Box
//               sx={{
//                 mb: 5,
//                 p: 3,
//                 borderRadius: 2,
//                 background:
//                   "linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 100%)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 fontWeight="bold"
//                 gutterBottom
//                 sx={{ mb: 2 }}
//               >
//                 Cast & Production
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on larger screens
//                   justifyContent: "space-between",
//                   gap: 3, // Space between items
//                 }}
//               >
//                 {/* Director */}
//                 <Box sx={{ flex: 1, textAlign: "center" }}>
//                   <Avatar
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       mx: "auto",
//                       mb: 1.5,
//                       bgcolor: "rgba(229, 9, 20, 0.2)",
//                       border: "2px solid rgba(229, 9, 20, 0.7)",
//                     }}
//                   >
//                     <MovieFilterIcon sx={{ fontSize: 36 }} />
//                   </Avatar>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom>
//                     Director
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: "#e0e0e0",
//                       fontWeight: "medium",
//                     }}
//                   >
//                     {episode.director}
//                   </Typography>
//                 </Box>

//                 {/* Main Lead */}
//                 <Box sx={{ flex: 1, textAlign: "center" }}>
//                   <Avatar
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       mx: "auto",
//                       mb: 1.5,
//                       bgcolor: "rgba(229, 9, 20, 0.2)",
//                       border: "2px solid rgba(229, 9, 20, 0.7)",
//                     }}
//                   >
//                     <PersonIcon sx={{ fontSize: 36 }} />
//                   </Avatar>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom>
//                     Main Lead
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: "#e0e0e0",
//                       fontWeight: "medium",
//                     }}
//                   >
//                     {episode.main_lead}
//                   </Typography>
//                 </Box>

//                 {/* Streaming Platform */}
//                 <Box sx={{ flex: 1, textAlign: "center" }}>
//                   <Avatar
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       mx: "auto",
//                       mb: 1.5,
//                       bgcolor: "rgba(229, 9, 20, 0.2)",
//                       border: "2px solid rgba(229, 9, 20, 0.7)",
//                     }}
//                   >
//                     <TvIcon sx={{ fontSize: 36 }} />
//                   </Avatar>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom>
//                     Available On
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: "#e0e0e0",
//                       fontWeight: "medium",
//                     }}
//                   >
//                     {episode.streaming_platform}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             {/* About Section */}
//             <Typography variant="h4" fontWeight="bold" gutterBottom>
//               About this Episode
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{ lineHeight: 1.7, color: "#e0e0e0" }}
//             >
//               {episode.desc}
//             </Typography>

//             <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

//             {/* Ratings Section */}
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h5" fontWeight="bold" gutterBottom>
//                 Ratings & Reviews
//               </Typography>
//               <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//                 <Rating
//                   value={episode.starRating}
//                   precision={0.1}
//                   readOnly
//                   sx={{ mr: 1 }}
//                 />
//                 <Typography variant="h6" fontWeight="bold">
//                   {episode.starRating.toFixed(1)}
//                 </Typography>
//                 <Typography variant="body2" sx={{ ml: 1, color: "#aaa" }}>
//                   based on user reviews
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Right Column - Episode Info */}
//           <Box
//             sx={{
//               width: { xs: "100%", md: "33.333%" },
//               position: { md: "sticky" },
//               top: { md: "20px" },
//               alignSelf: { md: "flex-start" },
//             }}
//           >
//             <Stack
//               sx={{
//                 bgcolor: "#111",
//                 borderRadius: 2,
//                 p: 3,
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                 border: "1px solid #222",
//               }}
//               spacing={2}
//             >
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Episode Info
//               </Typography>

//               <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   Released
//                 </Typography>
//                 <Typography variant="body1" fontWeight="medium">
//                   {episode.date}, {episode.year}
//                 </Typography>
//               </Box>

//               <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   Duration
//                 </Typography>
//                 <Typography variant="body1" fontWeight="medium">
//                   {episode.duration}
//                 </Typography>
//               </Box>

//               <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   Genre
//                 </Typography>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
//                   <Chip
//                     label="Action"
//                     size="small"
//                     sx={{ bgcolor: "#222", color: "#fff" }}
//                   />
//                   <Chip
//                     label="Drama"
//                     size="small"
//                     sx={{ bgcolor: "#222", color: "#fff" }}
//                   />
//                 </Box>
//               </Box>

//               <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   IMDb Rating
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <StarIcon
//                     sx={{ color: "#FFCA28", mr: 0.5, fontSize: "1.2rem" }}
//                   />
//                   <Typography variant="body1" fontWeight="medium">
//                     {episode.starRating}/5
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   Languages
//                 </Typography>
//                 <Typography variant="body1" fontWeight="medium">
//                   English, Hindi, Spanish
//                 </Typography>
//               </Box>

//               <Box>
//                 <Typography variant="body2" sx={{ color: "#777" }}>
//                   Subtitles
//                 </Typography>
//                 <Typography variant="body1" fontWeight="medium">
//                   English, Spanish, French
//                 </Typography>
//               </Box> */}
//             </Stack>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default MoviesDetail;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  Container,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import { Episode } from '../../../config/MoviesData';
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

const MoviesDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError('No movie ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching movie with ID: ${id}`);
        const movieData = await getMoviesById(Number(id));
        console.log('Raw API response:', movieData);

        if (movieData) {
          const formattedEpisode: Episode = {
            id: movieData.id,
            title: movieData.title || 'Untitled',
            image: movieData.banner_url || movieData.poster_url || 'https://via.placeholder.com/1200x800',
            starRating: movieData.rating || 0,
            year: movieData.release_year || 0,
            duration: movieData.duration
              ? `${Math.floor(movieData.duration / 60)}h ${movieData.duration % 60}m`
              : '0h 0m',
            date: new Date().toISOString().split('T')[0], // Placeholder
            desc: movieData.description || 'No description available',
            director: movieData.director || 'Unknown',
            main_lead: movieData.main_lead || 'Unknown',
            streaming_platform: movieData.streaming_platform || 'Unknown',
          };
          console.log('Mapped episode:', formattedEpisode);
          setEpisode(formattedEpisode);
        } else {
          setError('Movie not found');
        }
      } catch (err: any) {
        console.error('Error fetching movie:', err.message);
        setError('Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center', bgcolor: '#000', color: '#fff' }}>
        <Typography variant="h4">Loading movie...</Typography>
      </Container>
    );
  }

  if (error || !episode) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center', bgcolor: '#000', color: '#fff' }}>
        <Typography variant="h4">{error || 'Episode not found'}</Typography>
        <Button variant="contained" color="primary" href="/" sx={{ mt: 3 }}>
          Return to Home
        </Button>
      </Container>
    );
  }

  const shortDesc = episode.desc.split('.')[0] + '.';

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Banner with Gradient Overlay */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 400, md: 500, lg: 600 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.9) 90%)',
            zIndex: 1,
          }}
        />
        <img
          src={episode.image}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />

        {/* Content Overlay */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 30, md: 60 },
              width: '100%',
              maxWidth: 'lg',
              pr: 4,
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
              }}
            >
              {episode.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Chip
                label={episode.year.toString()}
                size="medium"
                sx={{ bgcolor: 'black', color: 'white', mr: 1 }}
                icon={<CalendarTodayIcon fontSize="small" sx={{ color: 'white' }} />}
              />
              <Chip
                label={episode.duration}
                size="medium"
                sx={{ bgcolor: 'black', color: '#fff', mr: 1 }}
                icon={<AccessTimeIcon fontSize="small" />}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 1 } }}>
                <StarIcon sx={{ color: '#FFCA28', mr: 0.5 }} />
                <Typography variant="body1" fontWeight="bold">
                  {episode.starRating.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                mt: 2,
                maxWidth: { sm: '80%', md: '60%' },
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
              }}
            >
              {shortDesc}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  bgcolor: '#E50914',
                  color: '#fff',
                  px: 4,
                  '&:hover': { bgcolor: '#B20710' },
                }}
              >
                Watch Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#fff',
                  color: '#fff',
                  '&:hover': { borderColor: '#E50914', color: '#E50914' },
                }}
              >
                Add to Watchlist
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Column - Details Section */}
          <Box
            sx={{
              width: { xs: '100%', md: '66.666%' },
              pr: { xs: 0, md: 4 },
              mb: { xs: 4, md: 0 },
            }}
          >
            {/* Cast & Production Section */}
            <Box
              sx={{
                mb: 5,
                p: 3,
                borderRadius: 2,
                background:
                  'linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Cast & Production
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 1.5,
                      bgcolor: 'rgba(229, 9, 20, 0.2)',
                      border: '2px solid rgba(229, 9, 20, 0.7)',
                    }}
                  >
                    <MovieFilterIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Director
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#e0e0e0',
                      fontWeight: 'medium',
                    }}
                  >
                    {episode.director}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 1.5,
                      bgcolor: 'rgba(229, 9, 20, 0.2)',
                      border: '2px solid rgba(229, 9, 20, 0.7)',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Main Lead
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#e0e0e0',
                      fontWeight: 'medium',
                    }}
                  >
                    {episode.main_lead}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 1.5,
                      bgcolor: 'rgba(229, 9, 20, 0.2)',
                      border: '2px solid rgba(229, 9, 20, 0.7)',
                    }}
                  >
                    <TvIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Available On
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#e0e0e0',
                      fontWeight: 'medium',
                    }}
                  >
                    {episode.streaming_platform}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* About Section */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              About this Episode
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.7, color: '#e0e0e0' }}
            >
              {episode.desc}
            </Typography>

            <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Ratings Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ratings & Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating
                  value={episode.starRating}
                  precision={0.1}
                  readOnly
                  sx={{ mr: 1 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {episode.starRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: '#aaa' }}>
                  based on user reviews
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Episode Info */}
          <Box
            sx={{
              width: { xs: '100%', md: '33.333%' },
              position: { md: 'sticky' },
              top: { md: '20px' },
              alignSelf: { md: 'flex-start' },
            }}
          >
            <Stack
              sx={{
                bgcolor: '#111',
                borderRadius: 2,
                p: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                border: '1px solid #222',
              }}
              spacing={2}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Episode Info
              </Typography>

              <Box>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  Released
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {episode.date}, {episode.year}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {episode.duration}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  Genre
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                {/* <Chip
                      key={episode)}
                      label={genre.trim()}
                      size="small"
                      sx={{ bgcolor: '#222', color: '#fff' }}
                /> */}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  IMDb Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon
                    sx={{ color: '#FFCA28', mr: 0.5, fontSize: '1.2rem' }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    {episode.starRating}/5
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MoviesDetail;  