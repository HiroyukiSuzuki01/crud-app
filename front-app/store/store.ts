import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import registSlice from "./slices/registSlice";
import masterDataSlice from "./slices/masterDataSlice";

export const store = configureStore({
  reducer: {
    regist: registSlice,
    masterData: masterDataSlice,
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
