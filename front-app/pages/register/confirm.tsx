import { useRouter } from "next/router";
import axios from "axios";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { reset, selectRegist } from "../../store/slices/registSlice";
import { StringDecoder } from "string_decoder";

const Confirm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, age, gender, selfDescription, hobbies, prefecture, address } =
    useAppSelector(selectRegist);

  const genderDisplay = (gender: string) => {
    return gender === "1" ? "男性" : "女性";
  };

  const createDisplayAddress = (prefecture: string, address: string) => {
    return `${prefecture} ${address}`;
  };

  const backInputView = () => {
    dispatch(reset());
    router.replace("/register");
  };

  const registHandler = async () => {
    const url = "http://localhost:8080/";
    const response = await axios.get(url);
    console.log(response);
    console.log("regist");
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
            <td></td>
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
