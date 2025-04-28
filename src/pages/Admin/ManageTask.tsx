import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPremium: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send formData to your backend API
    console.log("Form submitted:", formData);
    // Navigate back to the movies list or dashboard after submission
    navigate("/admin/movies");
  };

  const handleCancel = () => {
    navigate("/admin/movies");
  };

  return (
    <Box
      sx={{
        bgcolor: "#181818",
        color: "#fff",
        p: 3,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          New Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Release Year"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            type="number"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Director"
            name="director"
            value={formData.director}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            placeholder="e.g., 2h 30m"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Main Lead"
            name="mainLead"
            value={formData.mainLead}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Streaming Platform"
            name="streamingPlatform"
            value={formData.streamingPlatform}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            placeholder="e.g., 8.5"
            type="number"
            inputProps={{ step: "0.1", min: "0", max: "10" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#facc15" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPremium}
                onChange={handleCheckboxChange}
                sx={{
                  color: "#00b7bf",
                  "&.Mui-checked": { color: "#facc15" },
                }}
              />
            }
            label="Premium"
            sx={{ color: "#fff", my: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel
              sx={{
                color: "#fff",
                "&.Mui-focused": { color: "#facc15" },
              }}
              shrink
            >
              Poster
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                "&:hover": { borderColor: "#facc15" },
                mt: 2,
                textTransform: "none",
              }}
            >
              {formData.poster ? formData.poster.name : "Choose File"}
              <input
                type="file"
                name="poster"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              sx={{
                color: "#fff",
                "&.Mui-focused": { color: "#facc15" },
              }}
              shrink
            >
              Banner
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                "&:hover": { borderColor: "#facc15" },
                mt: 2,
                textTransform: "none",
              }}
            >
              {formData.banner ? formData.banner.name : "Choose File"}
              <input
                type="file"
                name="banner"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#ffd700",
                color: "#181818",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": { bgcolor: "#e6c200" },
              }}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": { borderColor: "#facc15" },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ManageTask;