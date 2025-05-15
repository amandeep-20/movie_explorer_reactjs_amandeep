import React from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SliderItem from "./SliderItem";
import { Episode } from "../../../config/MoviesData";

interface BigSliderProps {
  items: Episode[];
}

interface BigSliderState {
  currentIndex: number;
}

class BigSlider extends React.Component<BigSliderProps, BigSliderState> {
  private timer: NodeJS.Timeout | null = null;

  constructor(props: BigSliderProps) {
    super(props);
    this.state = {
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((prevState) => ({
        currentIndex: (prevState.currentIndex + 1) % this.props.items.length,
      }));
    }, 5000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goToNextSlide = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex + 1) % this.props.items.length,
    }));
  };

  goToPrevSlide = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex - 1 + this.props.items.length) % this.props.items.length,
    }));
  };

  render() {
    const { items } = this.props;
    const { currentIndex } = this.state;

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          height: { xs: "80vh", md: "90vh" },
          maxHeight: "800px",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            position: "relative",
            background: "black",
          }}
        >
          {items.map((item, index) => (
            <SliderItem
              key={item.id}
              episode={item}
              isActive={index === currentIndex}
              index={index}
            />
          ))}
        </Box>

        <IconButton
          onClick={this.goToPrevSlide}
          sx={{
            position: "absolute",
            left: { xs: 8, md: 24 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0, 0, 0, 0.3)",
            color: "#fff",
            zIndex: 2,
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.5)",
              transform: "translateY(-50%) scale(1.1)",
            },
            width: { xs: 36, md: 48 },
            height: { xs: 36, md: 48 },
            transition: "all 0.2s ease-in-out",
          }}
          aria-label="Previous slide"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
        </IconButton>

        <IconButton
          onClick={this.goToNextSlide}
          sx={{
            position: "absolute",
            right: { xs: 8, md: 24 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0, 0, 0, 0.3)",
            color: "#fff",
            zIndex: 2,
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.5)",
              transform: "translateY(-50%) scale(1.1)",
            },
            width: { xs: 36, md: 48 },
            height: { xs: 36, md: 48 },
            transition: "all 0.2s ease-in-out",
          }}
          aria-label="Next slide"
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
        </IconButton>
      </Box>
    );
  }
}

export default BigSlider;