import { configureStore } from "@reduxjs/toolkit";
import mainLayoutState from "layouts/Main/mainLayoutState";

export const store = configureStore({
  reducer: {
    mainLayout: mainLayoutState,
  },
});
