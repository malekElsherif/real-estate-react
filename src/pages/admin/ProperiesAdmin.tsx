import React from "react";
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

const Myfav = ({ open, onClose }: MyfavProps) => {
  const {
    data,
    isPending:isLoading,
    isError,
  } = usegetmyfav();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
        >
          <FavoriteIcon
            sx={{
              color: "#ef4444",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            My Favorites
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          minHeight: 300,
          backgroundColor: "#f8fafc",
        }}
      >
        {/* Loading */}
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={250}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={250}
          >
            <Typography
              color="error"
              sx={{
                fontWeight: 500,
              }}
            >
              Failed to load your favorites.
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          (!data || data.length === 0) && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight={250}
              textAlign="center"
            >
              <FavoriteIcon
                sx={{
                  fontSize: 65,
                  color: "#d1d5db",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                No favorites yet
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                Properties you add to favorites will
                appear here.
              </Typography>
            </Box>
          )}

        {/* Favorites */}
        {!isLoading &&
          !isError &&
          data &&
          data.length > 0 && (
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              }}
              gap={2}
            >
              {data.map((favorite: any) => {
                const property =
                  favorite.property ?? favorite;

                return (
                  <Card
                    key={
                      favorite.id ??
                      property.id
                    }
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      overflow: "hidden",
                      transition:
                        "all 0.2s ease",
                      "&:hover": {
                        transform:
                          "translateY(-3px)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <CardContent>
                      {/* Title */}
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {property.title}
                      </Typography>

                      {/* Address */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                        }}
                      >
                        {property.address}
                      </Typography>

                      {/* Bottom */}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          mt: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {property.price} EGP
                        </Typography>

                        <FavoriteIcon
                          sx={{
                            color: "#ef4444",
                          }}
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
