import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface CustomDialogProps {
  open: boolean;
  title: string;
  message: string;
  cancel: () => void;
  exec: () => void;
  action?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  message,
  cancel,
  exec,
  action = "実行",
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>キャンセル</Button>
        <Button onClick={exec} autoFocus>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
