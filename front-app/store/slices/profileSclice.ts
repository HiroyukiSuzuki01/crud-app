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

type profileType = {
  profile: profile[];
};

const initialState: profileType = {
  profile: [],
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
  },
});

export const { setProfiles } = profileSlice.actions;

export const profileResult = (state: RootState) => state.profile.profile;

export default profileSlice.reducer;
