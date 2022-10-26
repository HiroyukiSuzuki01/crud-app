import axios from "axios";
import { useState } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  OutlinedInput,
  Checkbox,
  FormGroup,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  selectPrefectures,
  selectedHobbies,
} from "../../store/slices/masterDataSlice";
import { setProfiles } from "../../store/slices/profileSclice";
import {
  selectSearch,
  setSearchName,
  setSearchPref,
  setSearchHobbies,
} from "../../store/slices/searchSlice";
import { Profile } from "../../models/profileModel";
import SnackBar from "../UI/snackBar";
import BackDrop from "../UI/backdrop";

const SearchItems = () => {
  const dispatch = useAppDispatch();
  const { searchName, searchPref, searchHobbies } =
    useAppSelector(selectSearch);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(false);

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
          onChange={(event) => dispatch(setSearchHobbies(event.target.value))}
        />
      }
      label={hobby.Name}
      labelPlacement="end"
      checked={searchHobbies.includes(hobby.ID)}
    />
  ));

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = "http://localhost:8080/profile/search";
    try {
      setProgress(true);
      const { data } = await axios.get<Profile[]>(url, {
        params: {
          name: searchName,
          prefID: searchPref,
          hobbies: searchHobbies,
        },
      });
      dispatch(setProfiles(data));
      setProgress(false);
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
      <Grid>
        <form onSubmit={(event) => onSubmitHandler(event)}>
          <FormControl>
            <InputLabel htmlFor="name-input">名前</InputLabel>
            <OutlinedInput
              id="name-input"
              label="名前"
              value={searchName}
              onChange={(event) => dispatch(setSearchName(event.target.value))}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="prefecture-select-label">都道府県</InputLabel>
            <Select
              labelId="prefecture-select-label"
              label="都道府県"
              value={searchPref}
              onChange={(event) => dispatch(setSearchPref(event.target.value))}
            >
              {prefecturesOption}
            </Select>
          </FormControl>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              {hobbiesCheck}
            </FormGroup>
          </FormControl>
          <Button type="submit" variant="contained">
            検索
          </Button>
        </form>
      </Grid>

      <BackDrop progress={progress} />
      <SnackBar
        open={failed}
        close={closeSnackBar}
        duration={6000}
        message="データ取得に失敗しました"
      />
    </>
  );
};

export default SearchItems;
