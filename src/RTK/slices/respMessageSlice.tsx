import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const responseMessageSlice = createSlice({
  name: "responseMessage",
  initialState: "",
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setMessage } = responseMessageSlice.actions;
export default responseMessageSlice.reducer;
