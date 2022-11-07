import { Alert, Snackbar, SnackbarContent } from "@mui/material";

interface SnackBarProps {
  open: boolean;
  close: () => void;
  duration: number;
  message: string;
}

const SnackBar: React.FC<SnackBarProps> = ({
  open,
  close,
  duration,
  message,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={close}>
      <Alert onClose={close} severity="error" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
