import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface Search {
  searchName: string;
  searchPref: string;
  searchHobbies: string[];
}

const initialState: Search = {
  searchName: "",
  searchPref: "-1",
  searchHobbies: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchName: (
      state,
      action: PayloadAction<typeof initialState.searchName>
    ) => {
      state.searchName = action.payload;
    },
    setSearchPref: (
      state,
      action: PayloadAction<typeof initialState.searchPref>
    ) => {
      state.searchPref = action.payload;
    },
    setSearchHobbies: (state, action: PayloadAction<string>) => {
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

export const { setSearchName, setSearchPref, setSearchHobbies } =
  searchSlice.actions;

export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;
