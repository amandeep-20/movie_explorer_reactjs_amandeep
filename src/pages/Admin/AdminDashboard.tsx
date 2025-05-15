import React, { Component } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Carousel from "../../components/common/Carousel";
import BigSlider from "../../components/moviesLayout/BigSlider";
import { Episode } from "../../../config/MoviesData";
import { getAllMovies } from "../../utils/API";
import WithNavigation from "../../components/common/WithNavigation"; 
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

interface MoviesResponse {
  movies: Movie[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

interface Props {
  navigate: (path: string) => void; 
  subscriptionPlan?: string; 
  subscriptionLoading?: boolean;
  subscriptionError?: string | null;
}

interface State {
  topRatedMovies: Episode[];
  carousels: { title: string; genre: string }[];
  loading: boolean;
  error: string | null;
}

class AdminDashboard extends Component<Props, State> {
  state: State = {
    topRatedMovies: [],
    carousels: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchTopRatedMovies();
  }

  fetchTopRatedMovies = async () => {
    try {
      const movieData: MoviesResponse = await getAllMovies();
      const movieArray = movieData?.movies || [];

      if (movieArray.length > 0) {
        const uniqueGenres = Array.from(new Set(movieArray.map((movie) => movie.genre))).map(
          (genre) => ({
            title: genre as string,
            genre: genre as string,
          })
        );

        const formattedMovies: Episode[] = movieArray
          .filter((movie) => movie.rating >= 3)
          .map((movie: Movie) => ({
            id: movie.id,
            title: movie.title || "Untitled",
            image: movie.banner_url || "",
            image2: movie.poster_url || " ",
            starRating: movie.rating || 0,
            year: movie.release_year || 0,
            duration: movie.duration
              ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
              : "0h 0m",
            date: new Date().toISOString().split("T")[0],
            desc: movie.description || "No description available",
            director: movie.director || "Unknown",
            main_lead: movie.main_lead || "Unknown",
            streaming_platform: movie.streaming_platform || "Unknown",
            premium: movie.premium || false,
          }));

        this.setState({
          carousels: uniqueGenres,
          topRatedMovies: formattedMovies,
        });
      } else {
        this.setState({ error: "No movies available" });
      }
    } catch (err: any) {
      console.error("Error fetching movies:", err.message);
      this.setState({ error: "Failed to load movies" });
      toast.error("Failed to load movies");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = (id: number) => {
    this.setState(
      (prevState) => ({
        topRatedMovies: prevState.topRatedMovies.filter((movie) => movie.id !== id),
      }),
      () => {
        this.fetchTopRatedMovies(); 
      }
    );
  };

  render() {
    const { loading, error, topRatedMovies, carousels } = this.state;
    const { subscriptionLoading, subscriptionError } = this.props;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user?.role || "user";

    if (loading || subscriptionLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "#181818",
            color: "#fff",
          }}
        >
          <CircularProgress sx={{ color: "#E50914" }} />
        </Box>
      );
    }

    if (error || subscriptionError) {
      return (
        <Box sx={{ bgcolor: "#181818", color: "#fff", p: 3, minHeight: "100vh" }}>
          <Typography>{error || subscriptionError}</Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* <Header /> */}
        <BigSlider items={topRatedMovies} />
        {carousels.map((carousel, index) => (
          <Carousel
            key={index}
            title={carousel.title}
            genre={carousel.genre}
            role={role}
            onDelete={this.handleDelete}
          />
        ))}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        ></Box>
        <Footer />
      </Box>
    );
  }
}

export default WithNavigation(AdminDashboard);