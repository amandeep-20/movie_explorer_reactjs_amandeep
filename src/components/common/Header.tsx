import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';

interface HeaderProps {
  role: 'user' | 'supervisor';
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  const [filter, setFilter] = React.useState('');

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'black',
        py: 1,
        px: 2,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo Section */}
        <Button
          component={RouterLink}
          to="/user/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'black',
            borderRadius: '9999px',
            px: { xs: 1, md: 2 },
            py: { xs: 0.25, md: 0.5 },
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <MovieIcon sx={{ fontSize: { xs: 24, md: 32 }, color: 'white', mr: 1 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: { xs: '1rem', md: '1.5rem' },
              '&:hover': { color: '#E50914' },
            }}
          >
            Movie Explorer
          </Typography>
        </Button>

        {/* Navigation Links and Search Bar for Tablet and Larger Screens */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search movies..."
            size="small"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00b7bf',
                },
                '&:hover fieldset': {
                  borderColor: '#facc15',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#facc15',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#00b7bf' }} />
                </InputAdornment>
              ),
            }}
          />
          {/* Conditional Rendering: Upload Icon for Supervisor Role */}
          {role === 'supervisor' && (
            <IconButton
              sx={{
                color: '#ffffff',
                '&:hover': { color: '#facc15' },
              }}
              aria-label="Upload movie"
              component={RouterLink}
              to="/admin/manageTask" // Assuming this leads to the New Movie form
            >
              <UploadIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              displayEmpty
              size="small"
              sx={{
                color: '#ffffff',
                backgroundColor: '#333',
                '& .MuiSvgIcon-root': { color: '#ffffff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00b7bf' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#facc15' },
              }}
            >
              <MenuItem value="" disabled>
                Filter Movies
              </MenuItem>
              <MenuItem value="top-rated">Top Rated</MenuItem>
              <MenuItem value="thriller">Thriller</MenuItem>
              <MenuItem value="comedy">Comedy</MenuItem>
              <MenuItem value="horror">Horror</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            sx={{
              color: '#ffffff',
              '&:hover': { color: '#E50914' },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Profile Icon for Mobile View */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              color: '#ffffff',
              '&:hover': { color: '#facc15' },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;