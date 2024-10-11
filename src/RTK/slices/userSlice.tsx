import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../types";

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
    fullName: "",
    username: "",
    email: "",
    avatar: "",
    coverImage: "",
    watchHistory: [] as string[],
  },
  reducers: {
    addUser: (state, action: PayloadAction<UserType>) => {
      // console.log("user-Slice action payload--------", action.payload);

      const {
        _id,
        fullName,
        username,
        email,
        avatar,
        coverImage,
        watchHistory,
      } = action.payload;

      state._id = _id;
      state.fullName = fullName;
      state.username = username;
      state.email = email;
      state.avatar = avatar;
      state.coverImage = coverImage;
      state.watchHistory = watchHistory;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
