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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete this user?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
