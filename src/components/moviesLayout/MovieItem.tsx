import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useMediaQuery, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  isDeleting?: boolean;
}

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: '#181818',
          color: '#fff',
          borderRadius: '8px',
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ color: '#fff' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#fff' }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ color: '#E50914', '&:hover': { bgcolor: 'rgba(229, 9, 20, 0.1)' } }}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MovieItem: React.FC<MovieItemProps> = ({ episode, index, role, subscriptionPlan = 'none', onDelete }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isTouchDevice = useMediaQuery('(hover: none)');
  
  const isSupervisor = role === 'supervisor';
  const isPremiumLocked = episode.premium && subscriptionPlan !== 'premium';
  const isNavigatingRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  // Determine card size based on device
  const getCardSize = () => {
    if (isMobile) return { width: 150, height: 220 };
    if (isTablet) return { width: 180, height: 260 };
    return { width: 200, height: 300 };
  };

  const cardSize = getCardSize();

  // Set showOverlay based on hover state or if it's a touch device
  useEffect(() => {
    if (isTouchDevice) {
      // On touch devices, we'll manage this differently
      setShowOverlay(actionMenuOpen);
    } else {
      setShowOverlay(isHovered);
    }
  }, [isHovered, isTouchDevice, actionMenuOpen]);

  // Animation variants
  const cardVariants = {
    normal: { 
      scale: 1,
      zIndex: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      zIndex: 10,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    }
  };

  const imageVariants = {
    normal: { 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  const premiumBadgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    }
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isNavigatingRef.current) {
        return;
      }

      isNavigatingRef.current = true;
      console.log(`Clicked movie: ${episode.title} (ID: ${episode.id}, Premium: ${episode.premium}, Subscription: ${subscriptionPlan})`);

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        toast.info('Please log in to view movie details.');
        navigate('/', { replace: true });
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
        return;
      }

      if (isPremiumLocked) {
        toast.info('Please upgrade to a premium plan to view this movie.');
        navigate('/user/subscription', { replace: true });
      } else {
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
    navigate(`/admin/manageTask/${episode.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSupervisor) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleActionMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionMenuOpen(!actionMenuOpen);
  };

  return (
    <>
      <motion.div
        initial="normal"
        animate={isHovered ? "hover" : "normal"}
        variants={cardVariants}
        whileHover={!isTouchDevice ? "hover" : "normal"}
        onHoverStart={() => !isTouchDevice && setIsHovered(true)}
        onHoverEnd={() => !isTouchDevice && setIsHovered(false)}
        onClick={handleClick}
        style={{
          flex: '0 0 auto',
          width: cardSize.width,
          marginRight: '16px',
          marginBottom: '24px',
          position: 'relative',
          cursor: 'pointer',
          opacity: isPremiumLocked ? 0.7 : 1,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: showOverlay 
            ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' 
            : '0 4px 10px rgba(0,0,0,0.2)',
          height: cardSize.height,
        }}
      >
        {/* Main Image - Only thing visible when not hovering */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          variants={imageVariants}
        >
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
        </motion.div>

        {/* Premium badge - only visible when premium content */}
        {episode.premium && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={premiumBadgeVariants}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255, 215, 0, 0.8)',
                color: '#000',
                fontSize: isMobile ? '0.6rem' : '0.7rem',
                fontWeight: 'bold',
                padding: isMobile ? '2px 4px' : '4px 8px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <StarIcon sx={{ fontSize: isMobile ? 12 : 14 }} />
              PREMIUM
              {isPremiumLocked && <LockIcon sx={{ fontSize: isMobile ? 12 : 14, ml: 0.5 }} />}
            </Box>
          </motion.div>
        )}

        {/* Action menu button for touch devices */}
        {isTouchDevice && isSupervisor && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 5,
            }}
          >
            <IconButton
              onClick={toggleActionMenu}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                width: isMobile ? 32 : 36,
                height: isMobile ? 32 : 36,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
            >
              <MoreVertIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
            </IconButton>
          </motion.div>
        )}

        {/* Overlay that appears on hover or action menu click */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 100%)',
                zIndex: 3,
                padding: isMobile ? '10px' : '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Top section with platform name */}
              <motion.div variants={itemVariants}>
                <Chip
                  label={episode.streaming_platform}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(4px)',
                    fontSize: isMobile ? '0.6rem' : '0.75rem',
                    height: isMobile ? 20 : 24,
                    '& .MuiChip-label': {
                      px: isMobile ? 0.5 : 1,
                    },
                  }}
                />
              </motion.div>

              {/* Middle section with star rating */}
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ color: '#f5c518', fontSize: isMobile ? 16 : 20, mr: 0.5 }} />
                  <Typography variant="body1" sx={{ color: '#f5c518', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>
                    {episode.starRating.toFixed(1)}
                  </Typography>
                </Box>
              </motion.div>

              {/* Bottom section with title, year, duration, and action buttons */}
              <Box>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    color="#fff"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: isMobile ? '0.9rem' : isTablet ? '1rem' : '1.2rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {episode.title}
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon sx={{ color: 'grey.300', fontSize: isMobile ? 12 : 16, mr: 0.5 }} />
                    <Typography variant="body2" color="grey.300" sx={{ mr: 2, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                      {episode.year}
                    </Typography>
                    
                    <AccessTimeIcon sx={{ color: 'grey.300', fontSize: isMobile ? 12 : 16, mr: 0.5 }} />
                    <Typography variant="body2" color="grey.300" sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                      {episode.duration}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Action buttons - show on hover or if action menu is open */}
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isSupervisor && (showOverlay || !isTouchDevice) && (
                      <>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <IconButton
                            onClick={handleDeleteClick}
                            sx={{
                              backgroundColor: 'rgba(220, 0, 0, 0.8)',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: 'rgba(220, 0, 0, 1)',
                              },
                              width: isMobile ? 32 : 40,
                              height: isMobile ? 32 : 40,
                            }}
                            aria-label={`Delete ${episode.title}`}
                          >
                            <DeleteIcon sx={{ fontSize: isMobile ? 16 : 24 }} />
                          </IconButton>
                        </motion.div>
                        
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <IconButton
                            onClick={handleEditClick}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                              width: isMobile ? 32 : 40,
                              height: isMobile ? 32 : 40,
                            }}
                          >
                            <EditIcon sx={{ fontSize: isMobile ? 16 : 24 }} />
                          </IconButton>
                        </motion.div>
                      </>
                    )}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${episode.title}"? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(MovieItem);