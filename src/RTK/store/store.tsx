import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { uTubeApiSlice } from "../slices/API/uTubeApiSlice";
import userReducer from "../slices/userSlice";
import responseMessageReducer from "../slices/respMessageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    responseMessage: responseMessageReducer,
    [uTubeApiSlice.reducerPath]: uTubeApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(uTubeApiSlice.middleware),
});

setupListeners(store.dispatch);

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
