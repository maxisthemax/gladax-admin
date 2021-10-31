import React from "react";
import { useInView } from "react-intersection-observer";

//material-ui
import LinearProgress from "@mui/material/LinearProgress";

//redux

//assets

//styles

function InViewPage({ children }) {
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true,
  });

  //states

  //functions

  return <div ref={ref}>{inView ? children : <LinearProgress />}</div>;
}

export default React.memo(InViewPage);
