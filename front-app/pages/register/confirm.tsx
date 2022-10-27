import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { reset, selectRegist } from "../../store/slices/registSlice";
import {
  selectPrefecturesById,
  selectedHobbiesById,
} from "../../store/slices/masterDataSlice";
import Grid from "@mui/material/Unstable_Grid2";
import { Stack } from "@mui/system";
import BackDrop from "../../components/UI/backdrop";
import SnackBar from "../../components/UI/snackBar";
import {
  createGenderStr,
  createPrefStr,
  createDisplayHobbies,
} from "../../utils/createStr";
import { InitProfile, Profile } from "../../models/profileModel";
import classes from "./confirm.module.css";

const Confirm = () => {
  const [progress, setProgress] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    userId,
    name,
    age,
    gender,
    selfDescription,
    hobbies,
    prefecture,
    address,
  } = useAppSelector(selectRegist);
  const prefecturesById = useAppSelector(selectPrefecturesById);
  const hobbiesById = useAppSelector(selectedHobbiesById);

  const createDisplayAddress = (prefecture: string, address: string) => {
    const prefStr = createPrefStr(prefecture, prefecturesById);
    // 戻るボタンで入力項目の初期化対応
    if (prefStr === "") return "";

    return `${prefStr} ${address}`;
  };

  const backInputView = () => {
    if (!userId) {
      dispatch(reset());
    }
    router.replace("/register");
  };

  const registHandler = async () => {
    setProgress(true);

    const registData: InitProfile = {
      name,
      age,
      gender,
      selfDescription,
      hobbies,
      prefecture,
      address,
    };

    try {
      setProgress(false);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/create`,
        registData
      );
      router.replace("/register/complete");
    } catch (e) {
      console.error(e);
      setProgress(false);
      setFailed(true);
    }
  };

  const updateHandler = async () => {
    setProgress(true);
    const registData: Profile = {
      userId,
      name,
      age,
      gender,
      selfDescription,
      hobbies,
      prefecture,
      address,
    };

    try {
      setProgress(false);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/update`,
        registData
      );
      router.replace("/register/complete");
    } catch (e) {
      console.error(e);
      setProgress(false);
      setFailed(true);
    }
  };

  const closeSnackBar = () => {
    setFailed(false);
  };

  const actionArea = () => {
    if (!userId) {
      return (
        <Button type="button" variant="contained" onClick={registHandler}>
          登録する
        </Button>
      );
    } else {
      return (
        <Button type="button" variant="contained" onClick={updateHandler}>
          更新する
        </Button>
      );
    }
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >
        <Grid xs={5}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">名前</Typography>
                  </TableCell>
                  <TableCell>{name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">年齢</Typography>
                  </TableCell>
                  <TableCell>{age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">性別</Typography>
                  </TableCell>
                  <TableCell>{createGenderStr(gender)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">住所</Typography>
                  </TableCell>
                  <TableCell>
                    {createDisplayAddress(prefecture, address)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">趣味</Typography>
                  </TableCell>
                  <TableCell>
                    {createDisplayHobbies(hobbies, hobbiesById)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={`${classes.cellColor} ${classes.cellWidth}`}
                  >
                    <Typography variant="h6">自己紹介</Typography>
                  </TableCell>
                  <TableCell>{selfDescription}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid container alignItems="center" justifyContent="center">
          <Stack direction="row" spacing={3}>
            {actionArea()}
            <Button
              type="button"
              variant="contained"
              color="warning"
              onClick={backInputView}
            >
              戻る
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <BackDrop progress={progress} />
      <SnackBar
        open={failed}
        close={closeSnackBar}
        duration={6000}
        message="登録に失敗しました"
      />
    </>
  );
};

export default Confirm;
