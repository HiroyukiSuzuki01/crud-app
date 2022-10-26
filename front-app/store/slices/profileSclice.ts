import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Profile } from "../../models/profileModel";

type searchProfileType = {
  profile: Profile[];
};

const initialState: searchProfileType = {
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
