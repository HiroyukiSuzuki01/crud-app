import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  FormGroup,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectToken, setToken } from "../../store/slices/authSlice";

const Signin = () => {
  const [mail, setMail] = useState("test2@test.com");
  const [pass, setPass] = useState("1234");
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(selectToken);

  const loginHandler = async () => {
    const sendData = {
      mail,
      pass,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/login/`,
        sendData,
        { withCredentials: true }
      );
      // dispatch(setToken(data.response));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={5}
    >
      <Paper>
        <Grid>
          <FormControl>
            <InputLabel htmlFor="name-input">メールアドレス</InputLabel>
            <OutlinedInput
              label="メールアドレス"
              value={mail}
              onChange={(event) => setMail(event.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <InputLabel htmlFor="name-input">パスワード</InputLabel>
            <OutlinedInput
              label="パスワード"
              value={pass}
              onChange={(event) => setPass(event.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid container alignItems="center" justifyContent="center">
          <Button variant="contained" onClick={loginHandler}>
            SignIn
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Signin;
