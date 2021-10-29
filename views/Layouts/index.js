import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { useSnackbar } from "notistack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

//*components
import { TextFieldForm } from "components/Form";

//*material-ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

//*utils
import axios from "utils/http-anxios";

const makeOnDragEndFunction = (fields) => (result) => {
  if (!result.destination) {
    return;
  }
  fields.move(result.source.index, result.destination.index);
};

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

function Layout() {
  //*define
  const { data } = useSwrHttp("layout/home", {
    fallbackData: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  //*functions
  const onSubmit = async (values) => {
    try {
      const resData = data.layout
        ? await axios.patch("layout/home", {
            key: "home",
            layout: values,
          })
        : await axios.patch("layout/home", {
            key: "home",
            layout: values,
          });

      if (resData)
        enqueueSnackbar(resData.statusText, {
          variant: "success",
        });
    } catch (eror) {
      const errorMessage = eror.response.data.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <Form
      initialValues={data.layout}
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push },
          reset,
        },
        pristine,
        submitting,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Stack spacing={1} direction="row">
              <Button
                variant="contained"
                onClick={() =>
                  push("bannerCarousel", {
                    id: uuidv4(),
                    title: "",
                    description: "",
                    bannerUrl: "",
                    button_1_title: "",
                    button_1_url: "",
                    button_2_title: "",
                    button_2_url: "",
                  })
                }
              >
                Add Customer
              </Button>
              <Button type="submit" variant="contained">
                Update
              </Button>
              <Button
                variant="contained"
                onClick={reset}
                disabled={submitting || pristine}
              >
                Reset
              </Button>
            </Stack>
            <Box p={1} />
            <FieldArray name="bannerCarousel">
              {({ fields }) => (
                <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <Box ref={provided.innerRef}>
                        {fields.map((name, index) => (
                          <Draggable
                            key={name}
                            draggableId={name}
                            index={index}
                          >
                            {(provided) => (
                              <Paper
                                sx={{
                                  marginBottom: 2,
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Box p={1}>
                                  <Stack p={1} m={1} spacing={1}>
                                    <TextFieldForm
                                      name={`${name}.title`}
                                      label="Title"
                                    />
                                    <TextFieldForm
                                      label="Description"
                                      name={`${name}.description`}
                                    />
                                    <TextFieldForm
                                      label="Banner Url"
                                      name={`${name}.bannerUrl`}
                                    />

                                    <Stack spacing={3} direction="row">
                                      <Paper>
                                        <Box p={1}>
                                          <Stack spacing={1}>
                                            <TextFieldForm
                                              label="First Button Title"
                                              name={`${name}.button_1_title`}
                                            />
                                            <TextFieldForm
                                              label="First Button Url"
                                              name={`${name}.button_1_url`}
                                            />
                                          </Stack>
                                        </Box>
                                      </Paper>
                                      <Paper>
                                        <Box p={1}>
                                          <Stack spacing={1}>
                                            <TextFieldForm
                                              label="Second Button Title"
                                              name={`${name}.button_2_title`}
                                            />
                                            <TextFieldForm
                                              label="Second Button Url"
                                              name={`${name}.button_2_url`}
                                            />
                                          </Stack>
                                        </Box>
                                      </Paper>
                                    </Stack>
                                  </Stack>
                                  <Box textAlig="end">
                                    <Button
                                      variant="contained"
                                      onClick={() => fields.remove(index)}
                                    >
                                      Delete Banner
                                    </Button>
                                  </Box>
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </FieldArray>
          </form>
        );
      }}
    />
  );
}

export default Layout;
