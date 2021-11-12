import { memo } from "react";
import { FieldArray } from "react-final-form-arrays";
import { v4 as uuidv4 } from "uuid";

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "components/Icons";
import CarouselComponentDrag from "./CarouselComponentDrag";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

//*utils

//*useHooks

function DoubleBanner({ id, push, label }) {
  //*define

  //*functions

  return (
    <Accordion>
      <AccordionSummary expandIcon={<CustomIcon icon="expand_more" />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" spacing={1}>
          <Box>
            <Stack spacing={1} direction="row">
              <Button
                onClick={() =>
                  push(`${id}.0.data`, {
                    id: uuidv4(),
                    title: "",
                    description: "",
                    bannerPicUrl: "",
                    firstButtonTitle: "",
                    firstButtonLink: "",
                    secondButtonTitle: "",
                    secondButtonLink: "",
                  })
                }
              >
                Add Banner
              </Button>
            </Stack>
            <Box p={1} />
            <FieldArray name={`${id}.0.data`}>
              {({ fields }) => (
                <CarouselComponentDrag fields={fields} id={`${id}.0`} />
              )}
            </FieldArray>
          </Box>
          <Box>
            <Stack spacing={1} direction="row">
              <Button
                onClick={() =>
                  push(`${id}.1.data`, {
                    id: uuidv4(),
                    title: "",
                    description: "",
                    bannerPicUrl: "",
                    firstButtonTitle: "",
                    firstButtonLink: "",
                    secondButtonTitle: "",
                    secondButtonLink: "",
                  })
                }
              >
                Add Banner
              </Button>
            </Stack>
            <Box p={1} />
            <FieldArray name={`${id}.1.data`}>
              {({ fields }) => (
                <CarouselComponentDrag fields={fields} id={`${id}.1`} />
              )}
            </FieldArray>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(DoubleBanner);
