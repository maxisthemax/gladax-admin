//*lodash

//*components
import PaymentBuildProduct from "./PaymentBuildProduct";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

//*assets

//*redux

//*utils

//*helpers
import { numberWithCommas } from "helpers/numberHelpers";

//*style

//*custom components

function PaymentSummary({ totalAmount, orderProducts, delivery }) {
  //*define

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions

  //*useMemo

  return (
    <Box backgroundColor="#F2F2F2" height="100%" p={4}>
      <Stack spacing={2} direction="column">
        <Box>
          {orderProducts &&
            orderProducts.length > 0 &&
            orderProducts?.map((orderBuildData) => {
              return (
                <PaymentBuildProduct
                  orderBuildData={orderBuildData}
                  key={orderBuildData.buildId}
                />
              );
            })}
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">SUBTOTAL</Typography>
          <Typography variant="body2">
            RM {numberWithCommas(totalAmount - delivery?.price)}
          </Typography>
        </Box>
        {delivery && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">SHIPPING</Typography>
            <Typography variant="body2">
              RM {numberWithCommas(delivery?.price)}
            </Typography>
          </Box>
        )}
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">TOTAL</Typography>
          <Typography variant="body2">
            RM {numberWithCommas(totalAmount)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default PaymentSummary;
