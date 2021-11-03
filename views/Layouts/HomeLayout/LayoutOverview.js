import { memo, useState } from "react";
import { FieldArray } from "react-final-form-arrays";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

//*lodash
import startCase from "lodash/startCase";

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "components/Icons";

//*material-ui
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { TextFieldForm } from "components/Form";

//*utils

//*useHooks

function LayoutOverview({ push, change }) {
  //*define
  const popupState = usePopupState({
    variant: "popover",
    popupId: "layoutOverviewMenu",
  });

  //*states
  const [isEdit, setIsEdit] = useState(false);

  //*functions
  const makeOnDragEndFunction = (fields) => (result) => {
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  };
  const handleAddNewLayout = (value) => {
    push("layoutOverview", {
      id: uuidv4(),
      key: value,
      label: `${startCase(value)}`,
    });
    popupState.close();
  };
  const handleAddNewText = () => {
    const uuid = uuidv4();
    push("layoutOverview", {
      id: uuid,
      key: "text",
      label: `Text`,
    });
    change(uuid, { title: "", variant: "" });
    popupState.close();
  };

  return (
    <Paper>
      <Box p={2}>
        <FieldArray name="layoutOverview">
          {({ fields }) => {
            return (
              <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <List ref={provided.innerRef} dense disablePadding>
                      {fields.map((name, index) => (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <ListItem
                              dense
                              component={Paper}
                              square
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  onClick={() => {
                                    fields.remove(index);
                                    change(fields.value[index].id, undefined);
                                  }}
                                >
                                  <CustomIcon icon="delete" />
                                </IconButton>
                              }
                            >
                              <ListItemIcon {...provided.dragHandleProps}>
                                <CustomIcon icon="drag_handle" />
                              </ListItemIcon>
                              {isEdit ? (
                                <TextFieldForm
                                  label="Label"
                                  name={`${name}.label`}
                                />
                              ) : (
                                <ListItemText
                                  primary={fields.value[index].label}
                                ></ListItemText>
                              )}
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            );
          }}
        </FieldArray>
        <Box p={2} />
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<CustomIcon icon="add" color="white" />}
            {...bindTrigger(popupState)}
          >
            Layout
          </Button>
          <Button
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            Edit
          </Button>
          <Button type="submit" onClick={() => setIsEdit(false)}>
            Save
          </Button>
        </Stack>
      </Box>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={handleAddNewText}>Text</MenuItem>
        <MenuItem onClick={() => handleAddNewLayout("bannerCarousel")}>
          Banner Carousel
        </MenuItem>
        <MenuItem onClick={() => handleAddNewLayout("doubleBannerCarousel")}>
          Double Banner Carousel
        </MenuItem>
        <MenuItem onClick={() => handleAddNewLayout("gridSlider")}>
          Grid Slider
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default memo(LayoutOverview);
