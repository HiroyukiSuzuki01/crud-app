import { useRouter } from "next/router";
import axios from "axios";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { reset, selectRegist } from "../../store/slices/registSlice";
import {
  selectPrefecturesById,
  selectedHobbiesById,
} from "../../store/slices/masterDataSlice";

const HOKKAIDO_ID = "1";
const TOKYO_ID = "13";
const PREF_ARR = ["26", "27"];

const Confirm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, age, gender, selfDescription, hobbies, prefecture, address } =
    useAppSelector(selectRegist);
  const prefecturesById = useAppSelector(selectPrefecturesById);
  const hobbiesById = useAppSelector(selectedHobbiesById);

  const genderDisplay = (gender: string) => {
    return gender === "1" ? "男性" : "女性";
  };

  const createDisplayAddress = (prefecture: string, address: string) => {
    const suffix = prefectureSuffix(prefecture);
    // 戻るボタンで入力項目の初期化対応
    if (prefecture === "-1") return "";

    return `${prefecturesById[prefecture].Name}${suffix} ${address}`;
  };

  const prefectureSuffix = (prefecture: string) => {
    if (prefecture === HOKKAIDO_ID) return "";
    if (prefecture === TOKYO_ID) return "都";
    if (PREF_ARR.includes(prefecture)) return "府";

    return "県";
  };

  const backInputView = () => {
    dispatch(reset());
    router.replace("/register");
  };

  const registHandler = async () => {
    const url = "http://localhost:8080/";
    const response = await axios.get(url);
  };

  const createDisplayHobbies = () => {
    const hobbyConv = hobbies
      .map((hobby) => hobbiesById[hobby].Name)
      .join("　");

    return hobbyConv;
  };

  return (
    <>
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
            <td>{genderDisplay(gender)}</td>
          </tr>
          <tr>
            <td>住所</td>
            <td>{createDisplayAddress(prefecture, address)}</td>
          </tr>
          <tr>
            <td>趣味</td>
            <td>{createDisplayHobbies()}</td>
          </tr>
          <tr>
            <td>自己紹介</td>
            <td>{selfDescription}</td>
          </tr>
        </tbody>
      </table>
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
    </>
  );
};

export default Confirm;
