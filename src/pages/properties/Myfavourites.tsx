import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { usegetmyfav } from "../../hooks/usefav";
import Imgcard from "../properties/Imgcard";

type MyfavProps = {
  open: boolean;
  onClose: () => void;
};

const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  `}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const Myfav = ({ open, onClose }: MyfavProps) => {
  const { data: Data, isPending: loading, error } = usegetmyfav();

  // AxiosResponse -> actual favorites array is inside Data.data
  const data = Data?.data ?? [];

  return (
    <>
      <FontImports />

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#FFFDF9",
              borderRadius: 0,
              border: "1px solid #14213D",
              boxShadow: "none",
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #14213D",
            backgroundColor: "#FFFDF9",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <FavoriteIcon
              sx={{
                color: "#B8452E",
                fontSize: 22,
              }}
            />

            <Typography
              className={serif}
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#14213D",
                fontSize: "1.25rem",
              }}
            >
              Saved Properties
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "#14213D",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "#EFEAE0",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent
          sx={{
            p: 3,
            backgroundColor: "#FFFDF9",
          }}
        >
          {/* Loading */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress
                size={32}
                sx={{
                  color: "#14213D",
                }}
              />

              <Typography
                className={mono}
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "#4A5568",
                }}
              >
                Fetching saved listings...
              </Typography>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Box
              sx={{
                border: "1px solid #B8452E",
                p: 4,
                textAlign: "center",
                my: 2,
              }}
            >
              <Typography
                className={mono}
                sx={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#B8452E",
                }}
              >
                Error 02
              </Typography>

              <Typography
                className={serif}
                sx={{
                  mt: 1,
                  color: "#14213D",
                  fontWeight: 500,
                }}
              >
                Failed to load your favorite properties.
              </Typography>
            </Box>
          )}

          {/* Empty State */}
          {!loading && !error && data.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                border: "1px dashed #14213D",
                px: 2,
              }}
            >
              <FavoriteIcon
                sx={{
                  fontSize: 48,
                  color: "#E4DFD3",
                  mb: 1.5,
                }}
              />

              <Typography
                className={serif}
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#14213D",
                }}
              >
                No saved properties yet
              </Typography>

              <Typography
                className={mono}
                sx={{
                  mt: 1,
                  fontSize: "0.8rem",
                  color: "#4A5568",
                }}
              >
                Click the heart icon on any listing to bookmark properties for
                later.
              </Typography>
            </Box>
          )}

          {/* Favorites Grid */}
          {!loading && !error && data.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {data.map((favorite: any) => {
                const property = favorite.property ?? favorite;

                return (
                  <Box
                    key={favorite.id ?? property.id}
                    className="relative flex flex-col border border-[#14213D] bg-[#FFFDF9]"
                  >
                    {/* Image Container */}
                    <div className="relative h-44 overflow-hidden border-b border-[#14213D] bg-[#EFEAE0]">
                      <Imgcard propertyId={Number(property.id)} />

                      <span
                        className={`${mono} absolute right-3 top-3 z-10 border border-[#14213D] bg-[#FFFDF9] p-1 text-[#B8452E]`}
                      >
                        <FavoriteIcon fontSize="small" />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <h4
                        className={`${serif} line-clamp-1 text-lg font-semibold text-[#14213D]`}
                      >
                        {property.title}
                      </h4>

                      <p
                        className={`${mono} mt-1 line-clamp-1 text-xs text-[#4A5568]`}
                      >
                        📍{" "}
                        {property.address ||
                          property.city ||
                          property.location ||
                          "Location specified"}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[#E4DFD3] pt-3">
                        <span
                          className={`${mono} text-base font-semibold text-[#B8863B]`}
                        >
                          {property.price?.toLocaleString()} EGP
                        </span>

                        <Link
                          to={`/properties/${property.id}`}
                          onClick={onClose}
                          className={`${mono} border border-[#14213D] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF]`}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Myfav;
