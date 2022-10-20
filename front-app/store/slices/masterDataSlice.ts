import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type Master = {
  ID: string;
  Name: string;
};

export type MasterById = {
  [ID: string]: Master;
};

export type MasterDataState = {
  prefectures: Master[];
  prefecturesById: MasterById;
  hobbies: Master[];
  hobbiesById: MasterById;
};

const initialState: MasterDataState = {
  prefectures: [],
  prefecturesById: {},
  hobbies: [],
  hobbiesById: {},
};

const createById = (masterData: Master[], byId: MasterById) => {
  for (const master of masterData) {
    byId[master.ID] = master;
  }
  return byId;
};

export const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    setPrefectures: (
      state,
      action: PayloadAction<typeof initialState.prefectures>
    ) => {
      state.prefectures = action.payload;

      const prefecturesById: MasterById = {};
      createById(action.payload, prefecturesById);
      state.prefecturesById = prefecturesById;
    },
    setHobbies: (state, action: PayloadAction<typeof initialState.hobbies>) => {
      state.hobbies = action.payload;

      const hobbiesById: MasterById = {};
      createById(action.payload, hobbiesById);
      state.hobbiesById = hobbiesById;
    },
  },
});

export const { setPrefectures, setHobbies } = masterDataSlice.actions;

export const selectPrefectures = (state: RootState) =>
  state.masterData.prefectures;

export const selectPrefecturesById = (state: RootState) =>
  state.masterData.prefecturesById;

export const selectedHobbies = (state: RootState) => state.masterData.hobbies;

export const selectedHobbiesById = (state: RootState) =>
  state.masterData.hobbiesById;

export default masterDataSlice.reducer;
