import { useRouter } from "next/router";
import {
  Checkbox,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setName,
  setAge,
  setGender,
  setSelfDescription,
  setHobby,
  setPrefecture,
  setAddress,
  selectRegist,
  reset,
} from "../../store/slices/registSlice";

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, age, gender, selfDescription, hobby, prefecture, address } =
    useAppSelector(selectRegist);

  // DBから取得予定
  const prefectures = [
    { id: "1", name: "北海道" },
    { id: "47", name: "沖縄" },
  ];

  const prefecturesSelect = [{ id: "-1", name: "未設定" }, ...prefectures];

  const prefecturesOption = prefecturesSelect.map((prefecture) => (
    <MenuItem key={prefecture.id} value={prefecture.id}>
      {prefecture.name}
    </MenuItem>
  ));

  const confirmHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    router.replace("/register/confirm");
  };

  return (
    <>
      <form>
        <table>
          <tbody>
            <tr>
              <td>名前</td>
              <td>
                <TextField
                  value={name}
                  label="名前"
                  variant="outlined"
                  size="small"
                  onChange={(event) => dispatch(setName(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>年齢</td>
              <td>
                <TextField
                  value={age}
                  label="年齢"
                  type="number"
                  variant="outlined"
                  size="small"
                  onChange={(event) => dispatch(setAge(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>性別</td>
              <td>
                <FormControl>
                  <RadioGroup row>
                    <FormControlLabel
                      value="1"
                      control={
                        <Radio
                          onChange={(event) =>
                            dispatch(setGender(event.target.value))
                          }
                        />
                      }
                      label="男性"
                      checked={gender === "1"}
                    />
                    <FormControlLabel
                      value="2"
                      control={
                        <Radio
                          onChange={(event) =>
                            dispatch(setGender(event.target.value))
                          }
                        />
                      }
                      label="女性"
                      checked={gender === "2"}
                    />
                  </RadioGroup>
                </FormControl>
              </td>
            </tr>
            <tr>
              <td>住所</td>
              <td>
                <FormControl size="small">
                  <InputLabel id="prefecture-select-label">都道府県</InputLabel>
                  <Select
                    labelId="prefecture-select-label"
                    label="都道府県"
                    value={prefecture}
                    onChange={(event) =>
                      dispatch(setPrefecture(event.target.value))
                    }
                  >
                    {prefecturesOption}
                  </Select>
                </FormControl>

                <TextField
                  value={address}
                  label="住所"
                  variant="outlined"
                  size="small"
                  onChange={(event) => dispatch(setAddress(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>趣味</td>
              <td>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="1"
                      control={
                        <Checkbox
                          onChange={(event) =>
                            dispatch(setHobby(event.target.value))
                          }
                        />
                      }
                      label="映画鑑賞"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="2"
                      control={
                        <Checkbox
                          onChange={(event) =>
                            dispatch(setHobby(event.target.value))
                          }
                        />
                      }
                      label="読書"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="3"
                      control={
                        <Checkbox
                          onChange={(event) =>
                            dispatch(setHobby(event.target.value))
                          }
                        />
                      }
                      label="買い物"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </td>
            </tr>
            <tr>
              <td>自己紹介</td>
              <td>
                <TextField
                  label="自己紹介"
                  multiline
                  rows={4}
                  onChange={(event) =>
                    dispatch(setSelfDescription(event.target.value))
                  }
                />
              </td>
            </tr>
            <tr>
              <td>写真</td>
              <td>
                <IconButton color="primary" aria-label="upload picture">
                  <input hidden accept="/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" onClick={confirmHandler}>
          送る
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          リセット
        </button>
      </form>
    </>
  );
};

export default Register;
