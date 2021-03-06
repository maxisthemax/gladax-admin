import { Form } from "react-final-form";
import { DatePicker } from "mui-rff";
import DateFnsUtils from "@date-io/date-fns";

//*lodash
import map from "lodash/map";

//*components
import useUploadAttachment from "components/useUploadAttachment";
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*helpers

//*styles

//*validation
import { createNewBuild } from "validation";

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";
import { convertToUtc } from "helpers/dateHelpers";

//*custom components

function CreateNewBuild() {
  //*define
  const { mutate } = useSwrHttp(`build`, {
    fallbackData: [],
  });
  const { startUpload, getTotalUploadedFiles, uploadAttachment } =
    useUploadAttachment();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const onSubmit = async (values) => {
    const { name, description, tags, weight, startDate, endDate } = values;

    const resData = getTotalUploadedFiles() === 0 ? [] : await startUpload();
    const uploadedDocumentIdArray = map(resData, "value.data.id");

    await axios.post("build", {
      name: name,
      description: description,
      tags: tags?.split(","),
      documentIds: uploadedDocumentIdArray,
      weight: weight,
      startDate: convertToUtc(startDate),
      endDate: convertToUtc(endDate),
    });
    mutate();
  };

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Form
            initialValues={{ description: "", weight: 0 }}
            validate={createNewBuild}
            onSubmit={onSubmit}
            render={({
              handleSubmit,
              invalid,
              form: { restart },
              submitting,
            }) => {
              return (
                <form
                  id="addNewBuild"
                  onSubmit={(e) => handleSubmit(e)?.then(restart)}
                  noValidate
                >
                  <Stack spacing={1} direction="column" flexWrap>
                    <TextFieldForm
                      label="Name"
                      name="name"
                      required={true}
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Description"
                      name="description"
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Tags"
                      name="tags"
                      required={true}
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Weight (gram)"
                      name="weight"
                      type="number"
                      required={true}
                      disabled={submitting}
                    />
                    <DatePicker
                      label="Start Date"
                      name="startDate"
                      required={true}
                      dateFunsUtils={DateFnsUtils}
                    />
                    <DatePicker
                      label="End Date"
                      name="endDate"
                      required={true}
                      dateFunsUtils={DateFnsUtils}
                    />
                  </Stack>
                  <Box p={1} />
                  {uploadAttachment}
                  <Button disabled={invalid || submitting} type="submit">
                    Create
                  </Button>
                </form>
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CreateNewBuild;
