import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Button from "@mui/material/Button";

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

const Confirm = () => {
  const [progress, setProgress] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, age, gender, selfDescription, hobbies, prefecture, address } =
    useAppSelector(selectRegist);
  const prefecturesById = useAppSelector(selectPrefecturesById);
  const hobbiesById = useAppSelector(selectedHobbiesById);

  const createDisplayAddress = (prefecture: string, address: string) => {
    const prefStr = createPrefStr(prefecture, prefecturesById);
    // 戻るボタンで入力項目の初期化対応
    if (prefecture === "-1") return "";

    return `${prefStr} ${address}`;
  };

  const backInputView = () => {
    dispatch(reset());
    router.replace("/register");
  };

  const registHandler = async () => {
    setProgress(true);
    const registData = {
      name,
      age,
      gender,
      selfDescription,
      hobbies,
      prefecture,
      address,
    };
    try {
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

  const closeSnackBar = () => {
    setFailed(false);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <table>
          <tbody>
            <tr>
              <td>名前</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>年齢</td>
              <td>{age}</td>
            </tr>
            <tr>
              <td>性別</td>
              <td>{createGenderStr(gender)}</td>
            </tr>
            <tr>
              <td>住所</td>
              <td>{createDisplayAddress(prefecture, address)}</td>
            </tr>
            <tr>
              <td>趣味</td>
              <td>{createDisplayHobbies(hobbies, hobbiesById)}</td>
            </tr>
            <tr>
              <td>自己紹介</td>
              <td>{selfDescription}</td>
            </tr>
          </tbody>
        </table>

        <Stack direction="row" spacing={3}>
          <Button type="button" variant="contained" onClick={registHandler}>
            登録する
          </Button>
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
