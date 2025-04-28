import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MovieItem from "./MovieItem";
import { Episode } from "../../../config/MoviesData";

interface CarouselProps {
  title: string; // Main title (e.g., "Top Rated")
  items: Episode[];
}

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200 + 16; // Match MovieItem width (200px) + margin-right (16px)
      const scrollDistance = direction === "left" ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ bgcolor: "#181818", color: "#fff", p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="#fff"
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        {title}
      </Typography>
      <Typography
          variant="h6"
          color="#fff"
          sx={{
            display: "inline",
            fontWeight: "bold",
            "&:before": {
              content: '"|"',
              color: "#ffd700",
              mr: 1,
            },
            "&:after": {
              content: '" >"',
              color: "#ffd700",
            },
          }}
        >
          "TV shows and movies just for you"
        </Typography>
      <Box position="relative">
        <Box
          ref={scrollRef}
          role="region"
          aria-label={title}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {items.map((item, index) => (
            <MovieItem key={item.id} episode={item} index={index} />
          ))}
        </Box>
        {canScrollLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
            aria-label={`Scroll ${title} left`}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        {canScrollRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
            aria-label={`Scroll ${title} right`}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(Carousel);