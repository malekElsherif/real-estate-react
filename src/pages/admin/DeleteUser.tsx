import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { usedeleteuser } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

type DeleteUserProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

const mono = "'IBM Plex Mono', ui-monospace, monospace";
const serif = "'Fraunces', Georgia, serif";

const DeleteUser = ({ id, open, onClose }: DeleteUserProps) => {
  const { mutate, isPending } = usedeleteuser(id);
  const queryclient = useQueryClient();

  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryclient.invalidateQueries({
          queryKey: ["getallusers"],
        });

        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 0,
            border: "1px solid #14213D",
            bgcolor: "#FFFDF9",
            boxShadow: "none",
            minWidth: { sm: 420 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: "1.5rem",
          color: "#14213D",
          borderBottom: "1px solid #E4DFD3",
        }}
      >
        Delete User
      </DialogTitle>

      <DialogContent sx={{ pt: "24px !important" }}>
        <Typography
          sx={{
            fontFamily: mono,
            fontSize: "0.8rem",
            lineHeight: 1.7,
            color: "#14213D",
          }}
        >
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #E4DFD3", gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{
            borderRadius: 0,
            border: "1px solid #14213D",
            color: "#14213D",
            fontFamily: mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            px: 2.5,
            "&:hover": { bgcolor: "#14213D", color: "#FFFDF9" },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={isPending}
          disableElevation
          sx={{
            borderRadius: 0,
            bgcolor: "#B8452E",
            fontFamily: mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            px: 2.5,
            "&:hover": { bgcolor: "#9c3a26" },
          }}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
