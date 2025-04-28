import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Carousel from "../../components/moviesLayout/Carousel";
import { topRated, hollywood, bollywood } from "../../../config/MoviesData";
import BigSlider from "../../components/moviesLayout/BigSlider";

const UserDashboard = () => {
  const carousels = [
    {
      title: "Top Rated",
      items: topRated,
    },
    {
      title: "Hollywood",
      items: hollywood,
    },
    {
      title: "Bollywood",
      items: bollywood,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header role="user" />
      <BigSlider items={topRated} />
      {carousels.map((carousel, index) => (
        <Carousel key={index} title={carousel.title} items={carousel.items} />
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
};

export default UserDashboard;