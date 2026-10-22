import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { usegetmyfav } from "../../hooks/usefav";

type MyfavProps = {
  open: boolean;
  onClose: () => void;
};

const mono = "'IBM Plex Mono', ui-monospace, monospace";
const serif = "'Fraunces', Georgia, serif";

const Myfav = ({ open, onClose }: MyfavProps) => {
  const {
    data,
    isPending: isLoading,
    isError,
  } = usegetmyfav();

  // data is AxiosResponse, so the actual array is inside data.data
  const favorites = data?.data ?? [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: {
          borderRadius: 0,
          border: "1px solid #14213D",
          bgcolor: "#FFFDF9",
          boxShadow: "none",
        } } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#14213D",
          color: "#FFFDF9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FavoriteIcon sx={{ color: "#B8863B" }} />

          <Typography
            sx={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: "1.5rem",
            }}
          >
            My Favorites
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ color: "#FFFDF9", "&:hover": { color: "#B8863B" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          minHeight: 300,
          bgcolor: "#FFFDF9",
          p: 3,
        }}
      >
        {/* Loading */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250,
            }}
          >
            <CircularProgress sx={{ color: "#B8863B" }} />
          </Box>
        )}

        {/* Error */}
        {isError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250,
            }}
          >
            <Typography
              sx={{
                fontFamily: mono,
                fontSize: "0.8rem",
                color: "#B8452E",
              }}
            >
              Failed to load your favorites.
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!isLoading && !isError && favorites.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250,
              textAlign: "center",
            }}
          >
            <FavoriteIcon
              sx={{ fontSize: 56, color: "#E4DFD3", mb: 2 }}
            />

            <Typography
              sx={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: "1.5rem",
                color: "#14213D",
              }}
            >
              No favorites yet
            </Typography>

            <Typography
              sx={{
                fontFamily: mono,
                fontSize: "0.75rem",
                color: "#4A5568",
                mt: 1,
              }}
            >
              Properties you add to favorites will appear here.
            </Typography>
          </Box>
        )}

        {/* Favorites */}
        {!isLoading && !isError && favorites.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            {favorites.map((favorite: any) => {
              const property = favorite.property ?? favorite;

              return (
                <Card
                  key={favorite.id ?? property.id}
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    border: "1px solid #E4DFD3",
                    bgcolor: "#FFFFFF",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "#B8863B",
                      boxShadow: "0 12px 30px -12px rgba(20,33,61,0.25)",
                    },
                  }}
                >
                  <CardContent>
                    {/* Title */}
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: serif,
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        color: "#14213D",
                      }}
                    >
                      {property.title}
                    </Typography>

                    {/* Address */}
                    <Typography
                      sx={{
                        fontFamily: mono,
                        fontSize: "0.72rem",
                        color: "#4A5568",
                        mt: 1,
                      }}
                    >
                      {property.address}
                    </Typography>

                    {/* Bottom */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #E4DFD3",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: mono,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "#B8863B",
                        }}
                      >
                        {property.price} EGP
                      </Typography>

                      <FavoriteIcon
                        sx={{ color: "#B8863B", fontSize: 20 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Myfav;
