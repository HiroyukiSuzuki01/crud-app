import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import registSlice from "./slices/registSlice";
import masterDataSlice from "./slices/masterDataSlice";
import profileSlice from "./slices/profileSclice";
import searchSlice from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    regist: registSlice,
    masterData: masterDataSlice,
    profile: profileSlice,
    search: searchSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
