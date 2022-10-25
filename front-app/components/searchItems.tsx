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
import { useState } from "react";

import { useAppSelector } from "../store/hooks";
import {
  selectPrefectures,
  selectedHobbies,
} from "../store/slices/masterDataSlice";
import axios from "axios";

const SearchItems = () => {
  const [prefecture, setPrefecture] = useState("-1");
  const [name, setName] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);

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
          onChange={(event) => selectedHobbyHandler(event.target.value)}
        />
      }
      label={hobby.Name}
      labelPlacement="end"
      checked={hobbies.includes(hobby.ID)}
    />
  ));

  const selectedHobbyHandler = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((v) => hobby !== v));
    } else {
      setHobbies([...hobbies, hobby]);
    }
  };

  const onSubmitHandler = async (event: any) => {
    event.preventDefault();
    const url = "http://localhost:8080/profile/search";
    const { data } = await axios.get(url);
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
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="prefecture-select-label">都道府県</InputLabel>
            <Select
              labelId="prefecture-select-label"
              label="都道府県"
              value={prefecture}
              onChange={(event) => setPrefecture(event.target.value)}
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
    </>
  );
};

export default SearchItems;
