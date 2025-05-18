import React, { Component } from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

class Footer extends Component {
  render() {
    return (
      <Box
        component="footer"
        sx={{
          background: "black;",
          color: "#e2e8f0",
          py: 8,
          px: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: { md: 1 }, mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 2, letterSpacing: "-0.025em" }}
              >
                FILMHUNT
              </Typography>
              <Typography variant="body2" sx={{ color: "#cbd5e0", lineHeight: 1.6 }}>
                Your go-to platform for discovering movies, curated picks, and cinematic journeys.
              </Typography>
            </Box>

            <Box sx={{ flex: { md: 1 }, mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "medium", mb: 2, textTransform: "uppercase" }}
              >
                Explore
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link
                  href="/user/getMovies"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}
                >
                  Discover
                </Link>
                <Link
                  href="/user/getMovies"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}
                >
                  Get in Touch
                </Link>
              </Box>
            </Box>

            <Box sx={{ flex: { md: 1 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "medium", mb: 2, textTransform: "uppercase" }}
              >
                Connect With Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="#" sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}>
                  <FacebookIcon fontSize="large" />
                </Link>
                <Link href="#" sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}>
                  <TwitterIcon fontSize="large" />
                </Link>
                <Link href="#" sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}>
                  <InstagramIcon fontSize="large" />
                </Link>
                <Link href="#" sx={{ color: "#cbd5e0", "&:hover": { color: "#4fd1c5" } }}>
                  <YouTubeIcon fontSize="large" />
                </Link>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid #4a5568",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: "#a0aec0" }}>
              © {new Date().getFullYear()} FILMHUNT. Built for movie enthusiasts.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default Footer;