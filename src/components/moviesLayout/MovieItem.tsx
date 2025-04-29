import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import primeLogo from '../../assets/images/prime.svg';
import { useRole } from '../../context/RoleContext';

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

interface MovieItemProps {
  episode: Episode;
  index: number;
}

const MovieItem: React.FC<MovieItemProps> = ({ episode }) => {
  const navigate = useNavigate();
  const { role } = useRole();
  const isAdmin = role === 'admin'; // Corrected to check for "admin"

  const handleClick = () => {
    navigate(`/user/viewMovieDetail/${episode.id}`);
  };

  const handleEditClick = () => {
    navigate(`/admin/editMovie/${episode.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        flex: '0 0 auto',
        width: { xs: 150, sm: 200 },
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        mr: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 225, sm: 300, md: 350 },
          overflow: 'hidden',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src={episode.image}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          loading="lazy"
          width={200}
          height={300}
        />
        <Box
          component="img"
          src={primeLogo}
          alt="Prime Logo"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 40,
            height: 'auto',
            opacity: 0.9,
            zIndex: 1,
          }}
        />
        {isAdmin && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              zIndex: 1,
            }}
            aria-label={`Edit ${episode.title}`}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography
        variant="subtitle1"
        color="#fff"
        mt={1}
        title={episode.title}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          transition: 'color 0.3s ease',
          '@media (hover: hover)': {
            '&:hover': {
              color: '#ffd700',
            },
          },
        }}
      >
        {episode.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        <StarIcon sx={{ color: '#f5c518', fontSize: 16, mr: 0.5 }} />
        <Typography variant="body2" color="gray">
          {episode.starRating}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="gray"
        sx={{
          transition: 'color 0.3s ease',
          '@media (hover: hover)': {
            '&:hover': {
              color: '#ccc',
            },
          },
        }}
      >
        {episode.year} • {episode.duration} • {episode.date}
      </Typography>
    </Box>
  );
};

export default React.memo(MovieItem); 