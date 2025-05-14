import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputLabel,
  FormControl,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import toast from "react-hot-toast";
import { createMovie, updateMovie, getMoviesById } from "../../utils/API";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import MovieIcon from "@mui/icons-material/Movie";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

interface MovieFormData {
  title: string;
  genre: string;
  releaseYear: string;
  director: string;
  duration: string;
  description: string;
  mainLead: string;
  streamingPlatform: string;
  rating: string;
  poster: File | null;
  banner: File | null;
  isPremium: boolean;
}

const ManageTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    duration: "",
    description: "",
    mainLead: "",
    streamingPlatform: "",
    rating: "",
    poster: null,
    banner: null,
    isPremium: false,
  });
  
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Check authentication and fetch movie data for edit mode
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to manage movies.");
      navigate("/");
      return;
    }

    if (isEditMode && id) {
      const fetchMovie = async () => {
        try {
          const movieData = await getMoviesById(Number(id));
          if (movieData) {
            setFormData({
              title: movieData.title || "",
              genre: movieData.genre || "",
              releaseYear: movieData.release_year?.toString() || "",
              director: movieData.director || "",
              duration: movieData.duration?.toString() || "",
              description: movieData.description || "",
              mainLead: movieData.main_lead || "",
              streamingPlatform: movieData.streaming_platform || "",
              rating: movieData.rating?.toString() || "",
              poster: null,
              banner: null,
              isPremium: movieData.premium || false,
            });
            
            if (movieData.poster_url) {
              setPosterPreview(movieData.poster_url);
            }
            if (movieData.banner_url) {
              setBannerPreview(movieData.banner_url);
            }
          } else {
            toast.error("Movie not found");
          }
        } catch (error) {
          toast.error("Failed to load movie data");
        }
      };
      fetchMovie();
    }
    window.scroll(0,0);
  }, [navigate, id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "poster") {
          setPosterPreview(reader.result as string);
        } else if (name === "banner") {
          setBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPremium: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let movie;
      if (isEditMode && id) {
        movie = await updateMovie(Number(id), formData);
        if (movie) {
          toast.success("Movie updated successfully!");
        }
      } else {
        movie = await createMovie(formData);
        if (movie) {
          toast.success("Movie added successfully!");
        }
      }
      if (movie) {
        setFormData({
          title: "",
          genre: "",
          releaseYear: "",
          director: "",
          duration: "",
          description: "",
          mainLead: "",
          streamingPlatform: "",
          rating: "",
          poster: null,
          banner: null,
          isPremium: false,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
};
  
  
  const handleCancel = () => {
    navigate("/user/dashboard");
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { 
        borderColor: "rgba(0, 183, 191, 0.5)",
        borderWidth: 2,
      },
      "&:hover fieldset": { 
        borderColor: "#E50914",
        borderWidth: 2,
      },
      "&.Mui-focused fieldset": { 
        borderColor: "#facc15",
        borderWidth: 2,
      },
      borderRadius: 1,
    },
    "& .MuiInputLabel-root": { 
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": { 
      color: "#facc15",
      fontWeight: 600,
    },
    "& .MuiInputBase-input": { 
      color: "#fff",
      padding: "14px 16px",
    },
    mb: 2.5,
  };

  return (
    <Box
      sx={{
        bgcolor: 'rgb(20, 20, 30)',
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 1000,
            width: "100%",
            bgcolor: "rgba(20, 20, 20, 0.9)",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 10px rgba(229, 9, 20, 0.3), 0 0 20px rgba(0, 183, 191, 0.2)",
            position: "relative",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Top Accent Bar */}
          <Box 
            sx={{ 
              height: 6, 
              background: "linear-gradient(90deg, #E50914 0%, #00b7bf 100%)",
            }} 
          />
          
          <Box p={4}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={2} 
              mb={4}
            >
              <MovieIcon sx={{ fontSize: 36, color: "#E50914" }} />
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  color: "#fff",
                  textShadow: "0 0 10px rgba(229, 9, 20, 0.3)",
                  letterSpacing: 1,
                }}
              >
                {isEditMode ? "Edit Movie" : "Add New Movie"}
              </Typography>
            </Stack>
            
            <Divider 
              sx={{ 
                mb: 4, 
                opacity: 0.2, 
                borderColor: "rgba(255,255,255,0.2)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }} 
            />
            
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Row 1: Title and Genre */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      placeholder="Enter movie title"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      placeholder="e.g., Action, Drama, Comedy"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                </Box>

                {/* Row 2: Release Year, Duration, Rating */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Release Year"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      variant="outlined"
                      type="number"
                      required
                      placeholder="e.g., 2023"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Duration (minutes)"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      variant="outlined"
                      type="number"
                      required
                      placeholder="e.g., 120"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="0.0 - 10.0"
                      type="number"
                      inputProps={{ step: "0.1", min: "0", max: "10" }}
                      required
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                </Box>

                {/* Row 3: Director and Main Lead */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Director"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      placeholder="Enter director's name"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Main Lead"
                      name="mainLead"
                      value={formData.mainLead}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      placeholder="Enter lead actor/actress"
                      InputProps={{
                        sx: { 
                          backgroundColor: "rgba(0,0,0,0.2)",
                          backdropFilter: "blur(5px)",
                        }
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                </Box>

                {/* Row 4: Streaming Platform */}
                <Box>
                  <TextField
                    fullWidth
                    label="Streaming Platform"
                    name="streamingPlatform"
                    value={formData.streamingPlatform}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    placeholder="e.g., Netflix, Prime Video, Disney+"
                    InputProps={{
                      sx: { 
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(5px)",
                      }
                    }}
                    sx={textFieldStyle}
                  />
                </Box>

                {/* Row 5: Description */}
                <Box>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    placeholder="Enter movie description"
                    InputProps={{
                      sx: { 
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(5px)",
                      }
                    }}
                    sx={textFieldStyle}
                  />
                </Box>
                
                {/* Row 6: Poster and Banner */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5 }}>
                  {/* Poster Upload */}
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 3,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        border: "2px dashed rgba(0, 183, 191, 0.3)",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#E50914",
                        },
                        height: "100%",
                      }}
                    >
                      <Stack spacing={2} alignItems="center" justifyContent="center">
                        <CameraAltIcon sx={{ fontSize: 32, color: "#00b7bf" }} />
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                          Movie Poster
                        </Typography>
                        
                        {posterPreview ? (
                          <Box
                            sx={{
                              width: "100%",
                              height: 200,
                              backgroundImage: `url(${posterPreview})`,
                              backgroundSize: "contain",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              borderRadius: 1,
                              mb: 2,
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: 150,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="rgba(255,255,255,0.5)">
                              No poster selected
                            </Typography>
                          </Box>
                        )}
                        
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CameraAltIcon />}
                          fullWidth
                          sx={{
                            color: "#fff",
                            borderColor: "#00b7bf",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            "&:hover": { 
                              borderColor: "#E50914",
                              backgroundColor: "rgba(229, 9, 20, 0.1)",
                            },
                            textTransform: "none",
                            py: 1,
                          }}
                        >
                          {formData.poster ? "Change Poster" : "Upload Poster"}
                          <input
                            type="file"
                            name="poster"
                            hidden
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                  
                  {/* Banner Upload */}
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 3,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        border: "2px dashed rgba(0, 183, 191, 0.3)",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#E50914",
                        },
                        height: "100%",
                      }}
                    >
                      <Stack spacing={2} alignItems="center" justifyContent="center">
                        <WallpaperIcon sx={{ fontSize: 32, color: "#00b7bf" }} />
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                          Movie Banner
                        </Typography>
                        
                        {bannerPreview ? (
                          <Box
                            sx={{
                              width: "100%",
                              height: 200,
                              backgroundImage: `url(${bannerPreview})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: 1,
                              mb: 2,
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: 150,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="rgba(255,255,255,0.5)">
                              No banner selected
                            </Typography>
                          </Box>
                        )}
                        
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<WallpaperIcon />}
                          fullWidth
                          sx={{
                            color: "#fff",
                            borderColor: "#00b7bf",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            "&:hover": { 
                              borderColor: "#E50914",
                              backgroundColor: "rgba(229, 9, 20, 0.1)",
                            },
                            textTransform: "none",
                            py: 1,
                          }}
                        >
                          {formData.banner ? "Change Banner" : "Upload Banner"}
                          <input
                            type="file"
                            name="banner"
                            hidden
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                </Box>
                
                {/* Row 7: Premium Checkbox */}
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isPremium}
                        onChange={handleCheckboxChange}
                        sx={{
                          color: "#00b7bf",
                          "&.Mui-checked": { 
                            color: "#facc15",
                          },
                          "& .MuiSvgIcon-root": { 
                            fontSize: 28,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography fontWeight="medium" fontSize="1rem">
                        Premium Content
                      </Typography>
                    }
                    sx={{ 
                      color: "#fff",
                      bgcolor: "rgba(0,0,0,0.2)",
                      p: 1.5,
                      pl: 2,
                      borderRadius: 1,
                      border: "1px solid rgba(0, 183, 191, 0.3)",
                      width: "100%",
                    }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 4, opacity: 0.2, borderColor: "rgba(255,255,255,0.2)" }} />
              
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: "#E50914",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(229, 9, 20, 0.5)",
                    "&:hover": { 
                      bgcolor: "#c7000d",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(229, 9, 20, 0.7)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isEditMode ? "Update Movie" : "Create Movie"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: "#fff",
                    borderColor: "#00b7bf",
                    fontWeight: "medium",
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: 2,
                    "&:hover": { 
                      borderColor: "#00b7bf",
                      bgcolor: "rgba(0, 183, 191, 0.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Cancel & Go Back
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default ManageTask;