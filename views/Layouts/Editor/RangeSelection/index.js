import { memo } from "react";
import { FieldArray } from "react-final-form-arrays";
import { v4 as uuidv4 } from "uuid";

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "components/Icons";
import SelectionComponentDrag from "./SelectionComponentDrag";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

//*utils

//*useHooks

function RangeSelection({ id, push, label }) {
  //*define

  //*functions

  return (
    <Accordion>
      <AccordionSummary expandIcon={<CustomIcon icon="expand_more" />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1} direction="row">
          <Button
            onClick={() =>
              push(`${id}.data`, {
                id: uuidv4(),
                title: "",
                subtitle: "",
                imageUrl: "",
              })
            }
          >
            Add Selection
          </Button>
        </Stack>
        <Box p={1} />
        <FieldArray name={`${id}.data`}>
          {({ fields }) => <SelectionComponentDrag fields={fields} id={id} />}
        </FieldArray>
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(RangeSelection);
