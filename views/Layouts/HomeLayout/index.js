import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useSnackbar } from "notistack";

//*components
import { useDrawer } from "components/Drawers";
import CarouselBanner from "./CarouselBanner";
import LayoutOverview from "./LayoutOverview";
import GridSlider from "./GridSlider";

//*material-ui
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

//*utils
import axios from "utils/http-anxios";

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

function HomeLayout() {
  //*define
  const { Drawer, handleOpenDrawer } = useDrawer();
  const { data, mutate } = useSwrHttp("layout/home", {
    fallbackData: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  //*const
  const layoutOverview = data?.layout?.layoutOverview || [];

  //*functions
  const onSubmit = async (values) => {
    try {
      const resData = data.layout
        ? await axios.patch("layout/home", {
            layout: values,
          })
        : await axios.post("layout", {
            key: "home",
            layout: values,
          });

      if (resData)
        enqueueSnackbar(resData.statusText, {
          variant: "success",
        });
      mutate();
    } catch (eror) {
      const errorMessage = eror.response.data.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <Box>
      <Form
        initialValues={data.layout}
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={({
          handleSubmit,
          form: {
            change,
            mutators: { push, remove },
            reset,
          },
          pristine,
          submitting,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <LayoutOverview push={push} remove={remove} change={change} />
                </Grid>
                <Grid item xs={8}>
                  {layoutOverview.map(({ id, key }) => {
                    switch (key) {
                      case "bannerCarousel":
                        return <CarouselBanner key={id} id={id} push={push} />;
                      case "gridSlider":
                        return <GridSlider key={id} id={id} push={push} />;
                      default:
                        break;
                    }
                  })}
                </Grid>
              </Grid>
              <Box position="fixed" bottom={16} right={16}>
                <Stack spacing={2} direction="row">
                  <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    disabled={submitting || pristine}
                    type="submit"
                  >
                    {data.layout ? "Update" : "Create"}
                  </Fab>
                  <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={reset}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Fab>
                  <Fab
                    onClick={handleOpenDrawer}
                    variant="extended"
                    color="primary"
                    aria-label="add"
                  >
                    Preview
                  </Fab>
                </Stack>
              </Box>
            </form>
          );
        }}
      />

      <Drawer size={8}>
        <iframe
          src="http://localhost:3001"
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </Drawer>
    </Box>
  );
}

export default HomeLayout;
