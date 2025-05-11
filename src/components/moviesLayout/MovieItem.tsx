import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'react-toastify';
import { deleteMovie } from '../../utils/API';

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
  premium: boolean;
}

interface MovieItemProps {
  episode: Episode;
  index: number;
  role?: string;
  subscriptionPlan?: 'premium' | 'none';
  onDelete?: (id: number) => void;
}

const MovieItem: React.FC<MovieItemProps> = ({ episode, index, role, subscriptionPlan = 'none', onDelete }) => {
  const navigate = useNavigate();
  const isSupervisor = role === 'supervisor';
  const isPremiumLocked = episode.premium && subscriptionPlan !== 'premium';
  const isNavigatingRef = useRef(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isNavigatingRef.current) {
        console.log('Navigation already in progress, ignoring click');
        return;
      }

      isNavigatingRef.current = true;
      console.log(`Clicked movie: ${episode.title} (ID: ${episode.id}, Premium: ${episode.premium}, Subscription: ${subscriptionPlan})`);

      // Check if user is a guest
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.log('Guest user detected, redirecting to login page');
        toast.info('Please log in to view movie details.');
        navigate('/', { replace: true });
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
        return;
      }

      if (isPremiumLocked) {
        console.log('Premium content locked, redirecting to subscription page');
        toast.info('Please upgrade to a premium plan to view this movie.');
        navigate('/user/subscription', { replace: true });
      } else {
        console.log(`Navigating to movie details: /user/viewMovieDetail/${episode.id}`);
        navigate(`/user/viewMovieDetail/${episode.id}`, { replace: true });
      }

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
    },
    [navigate, episode, isPremiumLocked, subscriptionPlan]
  );

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Editing movie: ${episode.title} (ID: ${episode.id})`);
    navigate(`/admin/manageTask/${episode.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Deleting movie: ${episode.title} (ID: ${episode.id})`);
    if (isSupervisor) {
      const success = await deleteMovie(episode.id);
      if (success && onDelete) {
        onDelete(episode.id);
        toast.success('Movie deleted successfully');
      } else {
        toast.error('Failed to delete movie');
      }
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        flex: '0 0 auto',
        width: { xs: 150, sm: 200, md: 220 },
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        mr: 2,
        mb: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        opacity: isPremiumLocked ? 0.7 : 1,
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 225, sm: 300, md: 320 },
          overflow: 'hidden',
          borderRadius: '12px',
          transition: 'all 0.4s ease',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)',
            zIndex: 1,
            opacity: 0.8,
            transition: 'opacity 0.3s ease',
          },
          '@media (hover: hover)': {
            '&:hover:before': {
              opacity: 1,
            },
            '&:hover .delete-icon': {
              opacity: 1,
              transform: 'translate(-50%, -50%) scale(1)',
            },
          },
        }}
      >
        <img
          src={episode.image}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          loading="lazy"
          width={220}
          height={320}
        />

        <Chip
          label={episode.streaming_platform}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: { xs: 0, sm: 0, md: 10, lg: 10 },
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />

        {episode.premium && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: { xs: 0, sm: 0, md: 10, lg: 10 },
              backgroundColor: 'rgba(255, 215, 0, 0.8)',
              color: '#000',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <StarIcon sx={{ fontSize: 14 }} />
            PREMIUM
            {isPremiumLocked && <LockIcon sx={{ fontSize: 14, ml: 0.5 }} />}
          </Box>
        )}

        {isSupervisor && (
          <Tooltip title="Delete movie">
            <IconButton
              onClick={handleDeleteClick}
              className="delete-icon"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.8)',
                backgroundColor: 'rgba(220, 0, 0, 0.8)',
                color: '#fff',
                opacity: 0,
                zIndex: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(220, 0, 0, 1)',
                  transform: 'translate(-50%, -50%) scale(1.1) !important',
                },
                width: 48,
                height: 48,
              }}
              aria-label={`Delete ${episode.title}`}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        )}

        {isSupervisor && (
          <Tooltip title="Edit movie">
            <IconButton
              onClick={handleEditClick}
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                zIndex: 2,
                transition: 'all 0.3s ease',
              }}
              size="small"
              aria-label={`Edit ${episode.title}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '4px',
              padding: '2px 6px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <StarIcon sx={{ color: '#f5c518', fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
              {episode.starRating.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 1.5, px: 0.5 }}>
        <Typography
          variant="subtitle1"
          color="#fff"
          sx={{
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            transition: 'color 0.3s ease',
            '@media (hover: hover)': {
              '&:hover': {
                color: '#f5c518',
              },
            },
          }}
          title={episode.title}
        >
          {episode.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ color: 'grey.500', fontSize: 14, mr: 0.5 }} />
            <Typography variant="body2" color="grey.400">
              {episode.year}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ color: 'grey.500', fontSize: 14, mr: 0.5 }} />
            <Typography variant="body2" color="grey.400">
              {episode.duration}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MovieItem);