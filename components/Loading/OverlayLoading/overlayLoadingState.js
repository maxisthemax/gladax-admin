import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  overlayOpen: false,
};

export const overlayLoadingSlice = createSlice({
  name: "overlayLoading",
  initialState,
  reducers: {
    openOverlayLoading: (state) => {
      state.overlayOpen = true;
    },
    closeOverlayLoading: (state) => {
      state.overlayOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openOverlayLoading, closeOverlayLoading } =
  overlayLoadingSlice.actions;

export default overlayLoadingSlice.reducer;
