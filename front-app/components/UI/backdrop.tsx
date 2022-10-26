import { Backdrop, CircularProgress } from "@mui/material";

interface BackdropProps {
  progress: boolean;
}

const BackDrop: React.FC<BackdropProps> = ({ progress }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={progress}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackDrop;
