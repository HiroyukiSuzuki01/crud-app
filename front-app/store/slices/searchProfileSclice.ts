import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type profile = {
  userId: string;
  name: string;
  age: string;
  selfDescription: string;
  gender: string;
  hobbies: string[];
  prefecture: string;
  address: string;
};

type searchProfileType = {
  profile: profile[];
  searchName: string;
  searchPref: string;
  searchHobbies: string[];
};

const initialState: searchProfileType = {
  profile: [],
  searchName: "",
  searchPref: "-1",
  searchHobbies: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfiles: (
      state,
      action: PayloadAction<typeof initialState.profile>
    ) => {
      state.profile = action.payload;
    },
    setName: (state, action: PayloadAction<typeof initialState.searchName>) => {
      state.searchName = action.payload;
    },
    setPref: (state, action: PayloadAction<typeof initialState.searchPref>) => {
      state.searchPref = action.payload;
    },
    setHobbies: (state, action: PayloadAction<string>) => {
      if (state.searchHobbies.includes(action.payload)) {
        state.searchHobbies = state.searchHobbies.filter(
          (hobby) => hobby !== action.payload
        );
      } else {
        state.searchHobbies = [...state.searchHobbies, action.payload];
      }
    },
  },
});

export const { setProfiles, setName, setPref, setHobbies } =
  profileSlice.actions;

export const profileResult = (state: RootState) => state.profile.profile;

export const searchResult = (state: RootState) => state.profile;

export default profileSlice.reducer;
