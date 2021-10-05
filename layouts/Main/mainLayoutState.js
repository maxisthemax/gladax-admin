import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.drawerOpen = true;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openDrawer, closeDrawer, toggleDrawer } = layoutSlice.actions;

export default layoutSlice.reducer;
