import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type RegistState = {
  name: string;
  age: string;
  selfDescription: string;
  gender: string;
  hobbies: string[];
  prefecture: string;
  address: string;
};

const initialState: RegistState = {
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
} = registSlice.actions;

export const selectRegist = (state: RootState) => state.regist;

export default registSlice.reducer;
