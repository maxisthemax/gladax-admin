import { configureStore } from "@reduxjs/toolkit";
import mainLayoutState from "layouts/Main/mainLayoutState";
import overlayLoadingState from "components/Loading/OverlayLoading/overlayLoadingState";

export const store = configureStore({
  reducer: {
    mainLayout: mainLayoutState,
    overlayLoading: overlayLoadingState,
  },
});
