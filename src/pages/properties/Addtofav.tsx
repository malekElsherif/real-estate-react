import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  useaddtoFav,
  usedelfav,
  useistfav,
} from "../../hooks/usefav";

import { useQueryClient } from "@tanstack/react-query";

type AddtofavProps = {
  id: number;
};

const Addtofav = ({ id }: AddtofavProps) => {
  const queryClient = useQueryClient();

  // Check if property is already favorite
  const {
    data,
    isLoading: isCheckingFav,
  } = useistfav(id);

  // Add favorite
  const {
    mutate: addFavorite,
    isPending: isAdding,
  } = useaddtoFav(id);

  // Delete favorite
  const {
    mutate: deleteFavorite,
    isPending: isDeleting,
  } = usedelfav(id);

  const isFavorite = data?.data === true;

  const handleFavorite = () => {
    if (isFavorite) {
      // Remove from favorites
      deleteFavorite(undefined, {
        onSuccess: () => {
          console.log("Removed from favorites");

          queryClient.invalidateQueries({
            queryKey: ["isfav", id],
          });

          queryClient.invalidateQueries({
            queryKey: ["myfav"],
          });
        },
      });
    } else {
      // Add to favorites
      addFavorite(id, {
        onSuccess: () => {
          console.log("Added to favorites");

          queryClient.invalidateQueries({
            queryKey: ["isfav", id],
          });

          queryClient.invalidateQueries({
            queryKey: ["myfav"],
          });
        },
      });
    }
  };

  const isPending =
    isAdding ||
    isDeleting ||
    isCheckingFav;

  return (
    <Tooltip
      title={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      <span>
        <IconButton
          onClick={handleFavorite}
          disabled={isPending}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,

            "&:hover": {
              backgroundColor: "#fff1f2",
            },

            "&:disabled": {
              opacity: 0.6,
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon
              sx={{
                color: "#ef4444",
                fontSize: 28,
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: "#ef4444",
                fontSize: 28,
              }}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default Addtofav;
