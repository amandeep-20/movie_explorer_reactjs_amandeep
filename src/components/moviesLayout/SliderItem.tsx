import React from "react";
import { Box, Button, Typography, Fade, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon
import { Episode } from "../../../config/MoviesData";
import WithNavigation from "../common/WithNavigation";
import RoleContext from "../../context/RoleContext"; // Import RoleContext

interface SliderItemProps {
  episode: Episode;
  isActive: boolean;
  index: number;
  navigate?: (path: string) => void;
}

class SliderItem extends React.Component<SliderItemProps> {
  // Declare contextType to access RoleContext
  static contextType = RoleContext;
  declare context: React.ContextType<typeof RoleContext>;

  handleClick = () => {
    const { navigate, episode } = this.props;
    if (navigate) {
      navigate(`/user/viewMovieDetail/${episode.id}`);
    }
  };

  handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering handleClick
    const { navigate, episode } = this.props;
    if (navigate) {
      navigate(`/admin/editMovie/${episode.id}`);
    }
  };

  render() {
    const { episode, isActive } = this.props;
    const isAdmin = this.context.role === "admin"; // Check if user is admin

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
          zIndex: isActive ? 0 : -1,
          cursor: "pointer",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: { xs: 0, sm: 0, md: "50%" },
            width: "100%",
            height: "100%",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={episode.image}
            alt={episode.title}
            sx={{
              height: "100%",
              objectFit: "cover",
              width: { xs: "100%", sm: "100%", md: "50%" },
            }}
          />
        </Box>

        {/* Content Container */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "10%", sm: "15%", md: "150px" },
            bottom: { xs: "10%", sm: "15%", md: "40%" },
            left: { xs: 16, sm: 24, md: 80 },
            maxWidth: { xs: "92%", sm: "80%", md: "45%" },
            zIndex: 2,
          }}
        >
          {/* Title */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  pb: 3,
                  lineHeight: { xs: 1.1, md: 1 },
                  letterSpacing: "-0.02em",
                  backgroundImage:
                    "linear-gradient(120deg, #FFFFFF 0%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "100%",
                  textOverflow: "ellipsis",
                }}
              >
                {episode.title}
              </Typography>
            </Fade>
            {/* Description */}
            <Fade
              in={isActive}
              timeout={800}
              style={{ transitionDelay: isActive ? "600ms" : "0ms" }}
            >
              <Typography
                variant="body1"
                color="#fff"
                sx={{
                  mt: 3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  lineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  maxWidth: { xs: "100%", md: "90%" },
                  lineHeight: 1.6,
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  fontWeight: 300,
                }}
              >
                {episode.desc}
              </Typography>
            </Fade>
          </Box>

          {/* Buttons */}
          <Box sx={{ marginTop: "150px" }}>
            <Fade
              in={isActive}
              timeout={800}
              style={{ transitionDelay: isActive ? "700ms" : "0ms" }}
            >
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    bgcolor: "#fff",
                    color: "#000",
                    "&:hover": {
                      bgcolor: "#E50914",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(255,215,0,0.3)",
                    },
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Watch now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<InfoOutlinedIcon />}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    color: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-2px)",
                    },
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontWeight: 500,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Fade>

            {/* Meta Info */}
            <Fade
              in={isActive}
              timeout={800}
              style={{ transitionDelay: isActive ? "800ms" : "0ms" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 3 }}>
                <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                  Subscribe for ₹99/month
                </Typography>
                <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                  Watch with a Prime membership
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Box>

        {/* Edit Button for Admins */}
        {isAdmin && (
          <Fade
            in={isActive}
            timeout={800}
            style={{ transitionDelay: isActive ? "900ms" : "0ms" }}
          >
            <IconButton
              onClick={this.handleEditClick}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                zIndex: 3,
                transition: "all 0.3s ease",
              }}
              aria-label={`Edit ${episode.title}`}
            >
              <EditIcon />
            </IconButton>
          </Fade>
        )}
      </Box>
    );
  }
}

export default WithNavigation(SliderItem);