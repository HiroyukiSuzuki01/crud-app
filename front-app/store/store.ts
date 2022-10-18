import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import registSlice from "./slices/registSlice";

export const store = configureStore({
  reducer: {
    regist: registSlice,
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
