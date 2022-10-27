import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Checkbox,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  OutlinedInput,
  FormHelperText,
  Stack,
} from "@mui/material";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

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
import {
  setPrefectures,
  setHobbies,
  selectPrefectures,
  selectedHobbies,
} from "../../store/slices/masterDataSlice";
import { MasterDataProps } from "../../models/masterDataModel";
import classes from "./index.module.css";

interface InputError {
  isError: boolean;
  errorReason: string;
}

const Register = () => {
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

  const [nameError, setNameError] = useState<InputError>({
    isError: false,
    errorReason: "",
  });
  const [ageError, setAgeError] = useState<InputError>({
    isError: false,
    errorReason: "",
  });
  const [genderError, setGenderError] = useState<InputError>({
    isError: false,
    errorReason: "",
  });
  const [prefectureError, setPrefectureError] = useState<InputError>({
    isError: false,
    errorReason: "",
  });
  const [addressError, setAddressError] = useState<InputError>({
    isError: false,
    errorReason: "",
  });

  useEffect(() => {
    // dispatch(reset());
    const getMaster = async () => {
      const { data } = await axios.get<MasterDataProps>(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/masterData`
      );
      dispatch(setPrefectures(data.allPrefectures));
      dispatch(setHobbies(data.allHobbies));
    };
    if (!userId) {
      getMaster();
    }
  }, []);

  const prefectures = useAppSelector(selectPrefectures);
  const prefecturesSelect = [{ ID: "-1", Name: "未設定" }, ...prefectures];

  const prefecturesOption = prefecturesSelect.map((prefecture) => (
    <MenuItem key={`${prefecture.ID}-${prefecture.Name}`} value={prefecture.ID}>
      {prefecture.Name}
    </MenuItem>
  ));

  const hobbyItems = useAppSelector(selectedHobbies);
  const hobbiesCheck = hobbyItems.map((hobby) => (
    <FormControlLabel
      key={`${hobby.ID}-${hobby.Name}`}
      value={hobby.ID}
      control={
        <Checkbox
          onChange={(event) => dispatch(setHobby(event.target.value))}
        />
      }
      label={hobby.Name}
      labelPlacement="end"
      checked={hobbies.includes(hobby.ID)}
    />
  ));

  const confirmHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // Validation
    const nameCheck = inputNameCheck(name);
    const ageCheck = inputAgeCheck(age);
    const genderCheck = inputGenderCheck(gender);
    const prefectureCheck = inputPrefectureCheck(prefecture);
    const addressCheck = inputAddressCheck(address);

    if (
      !nameCheck ||
      !ageCheck ||
      !genderCheck ||
      !prefectureCheck ||
      !addressCheck
    ) {
      return;
    }
    router.replace("/register/confirm");
  };

  const inputNameCheck = (name: string): boolean => {
    let isError = false;
    let errorReason = "";
    let result = true;

    if (!name) {
      isError = true;
      errorReason = "名前を入力してください";
      result = false;
    }

    setNameError({ isError, errorReason });

    return result;
  };

  const inputAgeCheck = (age: string): boolean => {
    let isError = false;
    let errorReason = "";
    let result = true;

    if (age === "") {
      isError = true;
      errorReason = "年齢を入力してください";
      result = false;
    }
    if (+age < 0) {
      isError = true;
      errorReason = "年齢は0以上の数字を入力してください";
      result = false;
    }
    if (isNaN(+age) && age) {
      isError = true;
      errorReason = "年齢は数字を入力してください";
      result = false;
    }

    setAgeError({ isError, errorReason });

    return result;
  };

  const inputGenderCheck = (gender: string): boolean => {
    let isError = false;
    let errorReason = "";
    let result = true;

    if (!gender) {
      isError = true;
      errorReason = "選択してください";
      result = false;
    }

    setGenderError({ isError, errorReason });

    return result;
  };

  const inputPrefectureCheck = (prefecture: string): boolean => {
    let isError = false;
    let errorReason = "";
    let result = true;

    if (prefecture === "-1") {
      isError = true;
      errorReason = "都道府県を選択してください";
      result = false;
    }

    setPrefectureError({ isError, errorReason });

    return result;
  };

  const inputAddressCheck = (address: string): boolean => {
    let isError = false;
    let errorReason = "";
    let result = true;

    if (!address) {
      isError = true;
      errorReason = "住所を入力してください";
      result = false;
    }

    setAddressError({ isError, errorReason });

    return result;
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={3}
      >
        <Grid xs={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">名前</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl error={nameError.isError}>
                      <InputLabel htmlFor="name-input">名前</InputLabel>
                      <OutlinedInput
                        id="name-input"
                        label="名前"
                        value={name}
                        onChange={(event) =>
                          dispatch(setName(event.target.value))
                        }
                      />
                      {nameError.isError && (
                        <FormHelperText>{nameError.errorReason}</FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">年齢</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl error={ageError.isError}>
                      <InputLabel htmlFor="age-input">年齢</InputLabel>
                      <OutlinedInput
                        id="age-input"
                        label="年齢"
                        value={age}
                        type="number"
                        onChange={(event) =>
                          dispatch(setAge(event.target.value))
                        }
                      />
                      {ageError.isError && (
                        <FormHelperText>{ageError.errorReason}</FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">性別</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl error={genderError.isError}>
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
                      {genderError.isError && (
                        <FormHelperText>
                          {genderError.errorReason}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">住所</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={3}>
                      <FormControl error={prefectureError.isError}>
                        <InputLabel id="prefecture-select-label">
                          都道府県
                        </InputLabel>
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
                        {prefectureError.isError && (
                          <FormHelperText>
                            {prefectureError.errorReason}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl error={addressError.isError}>
                        <InputLabel htmlFor="address-input">住所</InputLabel>
                        <OutlinedInput
                          id="address-input"
                          label="住所"
                          value={address}
                          onChange={(event) =>
                            dispatch(setAddress(event.target.value))
                          }
                        />
                        {addressError.isError && (
                          <FormHelperText>
                            {addressError.errorReason}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">趣味</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        {hobbiesCheck}
                      </FormGroup>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">自己紹介</Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={selfDescription}
                      label="自己紹介"
                      multiline
                      rows={4}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(event) =>
                        dispatch(setSelfDescription(event.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellColor}>
                    <Typography variant="h6">写真</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" aria-label="upload picture">
                      <input hidden accept="/*" type="file" />
                      <PhotoCamera />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <hr />
        <Stack direction="row" spacing={3}>
          <Button type="button" variant="contained" onClick={confirmHandler}>
            送る
          </Button>
          <Button
            type="button"
            variant="contained"
            color="warning"
            onClick={() => dispatch(reset())}
          >
            リセット
          </Button>
        </Stack>
      </Grid>
    </>
  );
};

export default Register;
