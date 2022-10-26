import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Profile } from "../../models/profileModel";

const initialState: Profile = {
  userId: "",
  name: "",
  age: "",
  gender: "",
  selfDescription: "",
  hobbies: [],
  prefecture: "-1",
  address: "",
};

export const registSlice = createSlice({
  name: "regist",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<typeof initialState.name>) => {
      state.name = action.payload;
    },
    setAge: (state, action: PayloadAction<typeof initialState.age>) => {
      state.age = action.payload;
    },
    setGender: (state, action: PayloadAction<typeof initialState.gender>) => {
      state.gender = action.payload;
    },
    setSelfDescription: (
      state,
      action: PayloadAction<typeof initialState.selfDescription>
    ) => {
      state.selfDescription = action.payload;
    },
    setHobby: (state, action: PayloadAction<string>) => {
      if (state.hobbies.includes(action.payload)) {
        state.hobbies = state.hobbies.filter(
          (hobby) => hobby !== action.payload
        );
      } else {
        state.hobbies = [...state.hobbies, action.payload];
      }
    },
    setPrefecture: (
      state,
      action: PayloadAction<typeof initialState.prefecture>
    ) => {
      state.prefecture = action.payload;
    },
    setAddress: (state, action: PayloadAction<typeof initialState.address>) => {
      state.address = action.payload;
    },
    reset: (state) => {
      state.name = "";
      state.age = "";
      state.gender = "";
      state.selfDescription = "";
      state.hobbies = [];
      state.prefecture = "-1";
      state.address = "";
    },
    setUpdateProfile: (state, action: PayloadAction<Profile>) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.age = action.payload.age;
      state.gender = action.payload.gender;
      state.selfDescription = action.payload.selfDescription;
      state.hobbies = action.payload.hobbies;
      state.prefecture = action.payload.prefecture;
      state.address = action.payload.address;
    },
  },
});

export const {
  setName,
  setAge,
  setGender,
  setSelfDescription,
  setHobby,
  setPrefecture,
  setAddress,
  reset,
  setUpdateProfile,
} = registSlice.actions;

export const selectRegist = (state: RootState) => state.regist;

export default registSlice.reducer;
