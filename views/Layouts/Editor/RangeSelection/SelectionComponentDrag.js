import { memo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//*components
import { Button } from "components/Buttons";
import { TextFieldForm } from "components/Form";
import { CustomIcon } from "components/Icons";

//*material-ui
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

//*utils

//*helpers

//*style

//*usehooks

//*custom components

function RangeComponentDrag({ fields, id }) {
  //*define

  //*states

  //*const
  const marks = [
    {
      value: 0,
      label: "0°C",
    },
    {
      value: 20,
      label: "20°C",
    },
    {
      value: 37,
      label: "37°C",
    },
    {
      value: 100,
      label: "100°C",
    },
  ];

  //*let

  //*ref

  //*useEffect

  //*functions
  const makeOnDragEndFunction = (fields) => (result) => {
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  };
  function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 1;
  }
  function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <Stack
      p={1}
      m={1}
      spacing={1}
      marks={marks}
      step={null}
      valueLabelDisplay="auto"
    >
      <Slider
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
      />
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
                          <TextFieldForm name={`${name}.title`} label="Title" />
                          <TextFieldForm
                            label="Subtitle"
                            name={`${name}.subtitle`}
                          />
                          <TextFieldForm label="Tag" name={`${name}.tag`} />
                          <TextFieldForm
                            label="Image Url"
                            name={`${name}.imageUrl`}
                          />
                        </Stack>
                        <Box textAlign="end">
                          <Button onClick={() => fields.remove(index)}>
                            Delete Image
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
    </Stack>
  );
}

export default memo(RangeComponentDrag);
