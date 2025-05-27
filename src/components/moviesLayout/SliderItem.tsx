import React from "react";
import { Box, Button, Typography, Fade, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WithNavigation from "../common/WithNavigation";

export interface Episode {
  id: number;
  title: string;
  duration: string;
  date: string;
  image: string;
  image2: string;
  year: number;
  starRating: number;
  desc: string;
  director: string;
  main_lead: string;
  streaming_platform: string;
}

interface SliderItemProps {
  episode: Episode;
  isActive: boolean;
  index: number;
  navigate?: (path: string) => void;
}

class SliderItem extends React.Component<SliderItemProps> {
  handleClick = () => {
    const { navigate, episode } = this.props;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isGuest = !user || user.role === "guest"; 
    if (isGuest && navigate) {
      navigate("/");
    } else if (navigate) {
      navigate(`/user/viewMovieDetail/${episode.id}`);
    }
  };


  render() {
    const { episode, isActive } = this.props;
    return (
      <Box
        onClick={this.handleClick}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
          zIndex: isActive ? 1 : -1,
          cursor: "pointer",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#181818",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            overflow: "hidden",
            opacity: 0.3,
          }}
        >
          <Box
            component="img"
            src={episode.image}
            alt={episode.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>

        <Box
          sx={{
            flex: { xs: "0 0 auto", md: "0 0 40%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, md: 4 },
            height: { xs: "auto", md: "100%" },
          }}
        >
          <Box
            component="img"
            src={episode.image2}
            alt={`${episode.title} poster`}
            sx={{
              width: { xs: "30%", sm: "20%", md: "100%" },
              maxWidth: "250px",
              height: { xs: "80%", sm: "50%", md: "100%" },
              maxHeight: "300px",
              borderRadius: 2,
              boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            flex: { xs: "1 1 auto", md: "1 1 60%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 2, md: 4 },
            color: "#fff",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "400ms" : "0ms" }}
          >
            <Typography
              variant="h1"
              fontWeight="900"
              color="#fff"
              title={episode.title}
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "3rem" },
                pb: 2,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                backgroundImage:
                  "linear-gradient(120deg, #FFFFFF 0%, #FFD700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "100%",
                textOverflow: "ellipsis",
              }}
            >
              {episode.title}
            </Typography>
          </Fade>

          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "600ms" : "0ms" }}
          >
            <Typography
              variant="body1"
              color="#fff"
              sx={{
                mt: 2,
                display: "-webkit-box",
                WebkitLineClamp: { xs: 3, md: 4 },
                lineClamp: { xs: 3, md: 4 },
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: { xs: "0.9rem", md: "1rem" },
                maxWidth: { xs: "100%", md: "90%" },
                lineHeight: 1.6,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                fontWeight: 300,
              }}
            >
              {episode.desc}
            </Typography>
          </Fade>

          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "700ms" : "0ms" }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                {episode.duration}
              </Typography>
              <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                {episode.year}
              </Typography>
              <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                {episode.starRating} ★
              </Typography>
            </Box>
          </Fade>

          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "800ms" : "0ms" }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                justifyContent: { xs: "center", md: "flex-start" },
                flexWrap: "wrap",
              }}
            >
            </Box>
          </Fade>

          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "900ms" : "0ms" }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              {/* <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                Subscribe for ₹99/month
              </Typography> */}
              {/* <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                Watch with a Prime membership
              </Typography> */}
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  }
}

export default WithNavigation(SliderItem);