import { memo } from "react";
import { Select, Checkboxes } from "mui-rff";

//*components
import { TextFieldForm } from "components/Form";
import { CustomIcon } from "components/Icons";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

//*utils

//*useHooks

function Text({ id, label }) {
  //*define

  //*functions

  //*const
  const checkboxData = [
    { label: "Bold", value: '{ "fontWeight": "bold" }' },
    { label: "Italic", value: '{ "fontStyle": "italic" }' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<CustomIcon icon="expand_more" />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          <TextFieldForm name={`${id}.title`} label="Title" />
          <Stack spacing={1} direction="row">
            <Select name={`${id}.variant`} label="Select a Variant">
              <MenuItem value="caption">caption</MenuItem>
              <MenuItem value="h1">h1</MenuItem>
              <MenuItem value="h2">h2</MenuItem>
              <MenuItem value="h3">h3</MenuItem>
              <MenuItem value="h4">h4</MenuItem>
              <MenuItem value="h5">h5</MenuItem>
              <MenuItem value="h6">h6</MenuItem>
              <MenuItem value="inherit">inherit</MenuItem>
              <MenuItem value="overline">overline</MenuItem>
              <MenuItem value="subtitle1">subtitle1</MenuItem>
              <MenuItem value="subtitle2">subtitle2</MenuItem>
              <MenuItem value="string">string</MenuItem>
              <MenuItem value="body1">body1</MenuItem>
              <MenuItem value="body2">body2</MenuItem>
              <MenuItem value="button">button</MenuItem>
            </Select>
            <Select
              name={`${id}.position`}
              label="Select a Position"
              size="small"
              size="medium"
            >
              <MenuItem value="start">Start</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="end">End</MenuItem>
            </Select>
          </Stack>
          <Box>
            <Checkboxes
              formGroupProps={{ row: true }}
              label="Text Properties"
              name={`${id}.textProperties`}
              data={checkboxData}
            />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(Text);
