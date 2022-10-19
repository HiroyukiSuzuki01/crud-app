import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type Prefecture = {
  ID: string;
  Name: string;
};

export type PrefectureById = {
  [ID: string]: Prefecture;
};

export type MasterDataState = {
  prefectures: Prefecture[];
  prefecturesById: PrefectureById;
};

const initialState: MasterDataState = {
  prefectures: [],
  prefecturesById: {},
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
    },
    setPrefecturesById: (
      state,
      action: PayloadAction<typeof initialState.prefectures>
    ) => {
      const prefecturesById: PrefectureById = {};
      for (const prefecture of action.payload) {
        prefecturesById[prefecture.ID] = prefecture;
      }
      state.prefecturesById = prefecturesById;
    },
  },
});

export const { setPrefectures, setPrefecturesById } = masterDataSlice.actions;

export const selectPrefectures = (state: RootState) =>
  state.masterData.prefectures;

export const selectPrefecturesById = (state: RootState) =>
  state.masterData.prefecturesById;

export default masterDataSlice.reducer;
