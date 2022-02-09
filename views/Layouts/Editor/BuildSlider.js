import { memo } from "react";
import { FieldArray } from "react-final-form-arrays";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { Select, Radios } from "mui-rff";

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "components/Icons";

//*material-ui
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

//*utils

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

function BuildSlider({ id, push, label }) {
  //*define
  const { data } = useSwrHttp(`build`, {
    fallbackData: [],
  });
  const checkboxData = [
    { label: "Slider", value: "slider" },
    { label: "Hover", value: "hover" },
  ];

  //*functions
  const makeOnDragEndFunction = (fields) => (result) => {
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<CustomIcon icon="expand_more" />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1} direction="row">
          <Button
            onClick={() =>
              push(id, {
                id: uuidv4(),
                build: "",
              })
            }
          >
            Add Build
          </Button>
        </Stack>
        <Box p={1} />
        <FieldArray name={id}>
          {({ fields }) => (
            <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Box ref={provided.innerRef}>
                    {fields.map((name, index) => (
                      <Draggable key={name} draggableId={name} index={index}>
                        {(provided) => (
                          <Paper
                            sx={{
                              marginBottom: 2,
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <CustomIcon icon="drag_handle" color="black" />
                            </Box>
                            <Divider />
                            <Box p={1}>
                              <Stack p={1} m={1} spacing={1}>
                                <Radios
                                  label="Type"
                                  name={`${name}.type`}
                                  required={true}
                                  data={checkboxData}
                                />
                                <Select
                                  name={`${name}.build`}
                                  label="Select a Build"
                                >
                                  {data.map((build) => {
                                    return (
                                      <MenuItem value={build.id}>
                                        {build.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </Stack>
                              <Box textAlign="end">
                                <Button onClick={() => fields.remove(index)}>
                                  Delete Build
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
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(BuildSlider);
