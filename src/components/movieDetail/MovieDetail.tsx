import React from 'react';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus'; 

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

interface MoviesDetailProps {
  movie: Movie;
}
export interface Episode {
  id: number;
  title: string;
  duration: string;
  date: string;
  image: string;
  image2: string;
  year: number;
  starRating: number;
  desc: string;
  director: string; 
  main_lead: string; 
  streaming_platform: string;
  premium: boolean;
}
const MoviesDetail: React.FC<MoviesDetailProps> = ({ movie }) => {
  const { subscriptionPlan, loading, error } = useSubscriptionStatus(); // Use the hook

  const episode: Episode = {
    id: movie.id,
    title: movie.title || 'Untitled',
    image: movie.banner_url || movie.poster_url,
    image2: movie.poster_url || movie.banner_url,
    starRating: movie.rating || 0,
    year: movie.release_year || 0,
    duration: movie.duration
      ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
      : '0h 0m',
    date: new Date().toISOString().split('T')[0],
    desc: movie.description || 'No description available',
    director: movie.director || 'Unknown',
    main_lead: movie.main_lead || 'Unknown',
    streaming_platform: movie.streaming_platform || 'Unknown',
    premium: movie.premium || false,
  };

  const shortDesc = episode.desc.split('.')[0] + '.';

  // const isPremiumLocked = movie.premium && subscriptionPlan !== 'premium';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: 'error.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: 'rgb(20, 20, 30)', color: '#fff', minHeight: '100vh' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'rgb(20, 20, 30)', color: '#fff', minHeight: '100vh' }}>
      <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '100vh', sm: 500, md: 550, lg: 600 },
        maxHeight: { xs: 600, sm: 'none' },
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
            'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.95) 90%)',
          zIndex: 1,
        }}
      />
      
      <Box
        component="img"
        src={episode.image}
        alt={`${episode.title} banner`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading="lazy"
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          <Box
            sx={{
              flex: { xs: '0 0 auto', md: '0 0 30%' },
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              alignItems: 'center',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box
              component="img"
              src={episode.image2 || episode.image}
              alt={`${episode.title} poster`}
              sx={{
                width: { xs: '50%', sm: '35%', md: '100%' },
                maxWidth: { xs: '180px', sm: '220px', md: '250px' },
                height: 'auto',
                maxHeight: { xs: '250px', sm: '300px', md: '350px' },
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            />
          </Box>

          <Box 
            sx={{ 
              flex: { xs: '1 1 auto', md: '1 1 70%' },
              textAlign: { xs: 'center', md: 'left' },
              width: '100%'
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                lineHeight: { xs: 1.2, md: 1.1 },
                mb: { xs: 1, sm: 2 }
              }}
            >
              {episode.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexWrap: 'wrap',
                gap: 1,
                mb: { xs: 2, sm: 2.5 },
              }}
            >
              <Chip
                label={episode.year.toString()}
                size="medium"
                sx={{ bgcolor: 'black', color: 'white' }}
                icon={<CalendarTodayIcon fontSize="small" sx={{ color: 'white' }} />}
              />
              <Chip
                label={episode.duration}
                size="medium"
                sx={{ bgcolor: 'black', color: '#fff' }}
                icon={<AccessTimeIcon fontSize="small" />}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 0.5 } }}>
                <StarIcon sx={{ color: '#FFCA28', mr: 0.5 }} />
                <Typography variant="body1" fontWeight="bold">
                  {episode.starRating.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                mb: 3,
                mx: { xs: 'auto', md: 0 },
                maxWidth: { xs: '100%', sm: '90%', md: '95%' },
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 3 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
              }}
            >
              {shortDesc}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box
            sx={{
              width: { xs: '100%', md: '66.666%' },
              pr: { xs: 0, md: 4 },
              mb: { xs: 4, md: 0 },
            }}
          >
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
                    flexDirection: { xs: 'row', sm: 'row' },
                    justifyContent: 'space-between',
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mx: 'auto',
                        mb: { xs: 1, sm: 1.5 },
                        bgcolor: 'rgba(229, 9, 20, 0.2)',
                        border: '2px solid rgba(229, 9, 20, 0.7)',
                      }}
                    >
                      <MovieFilterIcon sx={{ fontSize: { xs: 24, sm: 36 } }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Director
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#e0e0e0',
                        fontWeight: 'medium',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {episode.director}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mx: 'auto',
                        mb: { xs: 1, sm: 1.5 },
                        bgcolor: 'rgba(229, 9, 20, 0.2)',
                        border: '2px solid rgba(229, 9, 20, 0.7)',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: { xs: 24, sm: 36 } }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Main Lead
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#e0e0e0',
                        fontWeight: 'medium',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {episode.main_lead}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mx: 'auto',
                        mb: { xs: 1, sm: 1.5 },
                        bgcolor: 'rgba(229, 9, 20, 0.2)',
                        border: '2px solid rgba(229, 9, 20, 0.7)',
                      }}
                    >
                      <TvIcon sx={{ fontSize: { xs: 24, sm: 36 } }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Available On
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#e0e0e0',
                        fontWeight: 'medium',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {episode.streaming_platform}
                    </Typography>
                  </Box>
                </Box>
            </Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{  fontSize: { xs: 30, sm: 30 } }}>
              About this Episode
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.7, color: '#e0e0e0' }}
            >
              {episode.desc}
            </Typography>

            <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ratings & Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <StarIcon sx={{ color: '#FFCA28', mr: 0.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  {episode.starRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: '#aaa' }}>
                  based on user reviews
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: '33.333%' },
              top: { md: '20px' },
              alignSelf: { md: 'flex-start' },
            }}
          >
            <Stack
              sx={{
                background:
                  'linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 100%)',
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
                  {movie.genre.split(',').map((genre) => (
                    <Chip
                      key={genre.trim()}
                      label={genre.trim()}
                      size="small"
                      sx={{ bgcolor: '#222', color: '#fff' }}
                    />
                  ))}
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
                    {episode.starRating}/10
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  Subscription
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {subscriptionPlan === 'premium' ? 'Premium' : 'None'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MoviesDetail;