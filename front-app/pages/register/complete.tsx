import Link from "next/link";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";

const Complete = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={3}
    >
      <Grid>
        <Typography variant="h3">登録が完了しました</Typography>
      </Grid>
      <Grid>
        <Link href="/">一覧画面へ戻る</Link>
      </Grid>
    </Grid>
  );
};

export default Complete;
