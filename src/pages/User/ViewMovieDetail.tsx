import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { MoviesDetail } from "../../components/movieDetail.tsx/MovieDetail";
import { topRated, hollywood, bollywood } from "../../../config/MoviesData";
import Carousel from "../../components/moviesLayout/Carousel";

const ViewMovieDetail: React.FC = () => {
  const carousels = [
      {
        title: "Top Rated",
        items: topRated,
      },
    ];

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Header role="user" />
      <MoviesDetail />
      {carousels.map((carousel, index) => (
              <Carousel key={index} title={carousel.title} items={carousel.items} />
            ))}
      <Footer />
    </Box>
  );
};

export default ViewMovieDetail;