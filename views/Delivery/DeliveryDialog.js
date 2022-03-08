import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Form } from "react-final-form";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { CustomIcon } from "components/Icons";
import { useDialog } from "components/Dialogs";
import { Button } from "components/Buttons";

//*material-ui
import Stack from "@mui/material/Stack";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*validation
import { addNewDelivery } from "validation";

//*helpers

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*mui-rff

//*custom components

function DeliveryDialog() {
  //*define
  const { mutate, isValidating, error } = useSwrHttp("delivery", {
    fallbackData: [],
  });
  const { enqueueSnackbar } = useSnackbar();
  const { Dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (!isValidating)
      if (error?.response) {
        const errorMessage = error.response.data.message;
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
  }, [enqueueSnackbar, error, isValidating]);

  //*functions

  const onSubmit = async (value) => {
    try {
      await axios.post("delivery", value);
      mutate();
      enqueueSnackbar("Done", {
        variant: "success",
      });
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        startIcon={<CustomIcon icon="add" color="white" />}
      >
        New
      </Button>
      <Dialog
        title="Add New Delivery"
        handleOk={() => {
          document
            .getElementById("addNewDelivery")
            .dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
        }}
      >
        <Form
          initialValues={{ desc: "" }}
          validate={addNewDelivery}
          onSubmit={onSubmit}
          validateOnBlur={true}
          render={({ handleSubmit }) => {
            return (
              <form id="addNewDelivery" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextFieldForm label="Vendor" name="vendor" required={true} />
                  <TextFieldForm
                    label="Description"
                    name="desc"
                    required={true}
                  />
                  <TextFieldForm
                    label="Price"
                    name="price"
                    type="number"
                    required={true}
                  />
                  <TextFieldForm
                    label="Min Weight (g)"
                    name="criteria.minWeight"
                    type="number"
                    required={true}
                  />
                  <TextFieldForm
                    label="Max Weight (g)"
                    name="criteria.maxWeight"
                    type="number"
                    required={true}
                  />
                </Stack>
              </form>
            );
          }}
        />
      </Dialog>
    </>
  );
}

export default DeliveryDialog;
