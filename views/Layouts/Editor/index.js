import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useSnackbar } from "notistack";

//*components
import { useDrawer } from "components/Drawers";
import BuildSelection from "./BuildSelection";
import LayoutOverview from "./LayoutOverview";
import { useDialog } from "components/Dialogs";
import SingleBanner from "./CarouselBanner/SingleBanner";
import DoubleBanner from "./CarouselBanner/DoubleBanner";
import GridSlider from "./GridSlider";
import BuildSlider from "./BuildSlider";
import Text from "./Text";

//*material-ui
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

//*utils
import axios from "utils/http-anxios";

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

function LayoutEditor({ id, componentData }) {
  //*define
  const { Dialog, handleOpenDialog, handleCloseDialog } = useDialog();
  const { Drawer, handleOpenDrawer } = useDrawer();
  const { data, mutate } = useSwrHttp(`layout/${id}`, {
    fallbackData: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  //*const
  const layoutOverview = data?.layout?.layoutOverview || [];

  //*functions
  const onSubmit = async (values) => {
    try {
      const resData = data.layout
        ? await axios.patch(`layout/${id}`, {
            layout: values,
          })
        : await axios.post("layout", {
            key: id,
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
    <Box pb={10}>
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
            mutators: { push },
            reset,
          },
          pristine,
          submitting,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={3}>
                  <LayoutOverview
                    push={push}
                    change={change}
                    handleOpenDialog={handleOpenDialog}
                    componentData={componentData}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                  {layoutOverview.map(({ id, type, label }) => {
                    switch (type) {
                      case "text":
                        return <Text key={id} id={id} label={label} />;
                      case "bannerCarousel":
                        return (
                          <SingleBanner
                            key={id}
                            id={id}
                            push={push}
                            label={label}
                          />
                        );
                      case "doubleBannerCarousel":
                        return (
                          <DoubleBanner
                            key={id}
                            id={id}
                            push={push}
                            label={label}
                          />
                        );
                      case "gridSlider":
                        return (
                          <GridSlider
                            key={id}
                            id={id}
                            push={push}
                            label={label}
                          />
                        );
                      case "buildSlider":
                        return (
                          <BuildSlider
                            key={id}
                            id={id}
                            push={push}
                            label={label}
                          />
                        );
                      case "buildSelection":
                        return (
                          <BuildSelection
                            key={id}
                            id={id}
                            push={push}
                            label={label}
                          />
                        );

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
      <Dialog
        title="Code Editor"
        size="xl"
        handleOk={async () => {
          const value = JSON.parse(document.getElementById("dataLayout").value);
          await axios.patch(`layout/${id}`, {
            layout: value,
          });
          handleCloseDialog();
        }}
      >
        <TextField
          id="dataLayout"
          fullWidth
          defaultValue={JSON.stringify(data.layout, null, 2)}
          multiline
        />
      </Dialog>
    </Box>
  );
}

export default LayoutEditor;
