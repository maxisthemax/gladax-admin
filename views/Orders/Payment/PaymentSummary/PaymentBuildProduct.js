import { useMemo } from "react";

//*lodash
import sumBy from "lodash/sumBy";

//*components

//*material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

//*assets

//*redux

//*utils

//*helpers
import { numberWithCommas } from "helpers/numberHelpers";
import useSwrHttp from "useHooks/useSwrHttp";

//*style

//*custom components

function PaymentBuildProduct({ orderBuildData }) {
  //*define
  const { data } = useSwrHttp(
    orderBuildData?.buildId ? `build/${orderBuildData.buildId}` : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateOnReconnect: false,
    }
  );

  //*const

  //*useMemo

  const totalPriceMemo = useMemo(() => {
    return sumBy(orderBuildData.products, (data) => {
      return data?.price || 0;
    });
  }, [orderBuildData.products]);

  //*functions

  return (
    <Box>
      <Grid container spacing={2} pt={2} pb={2}>
        <Grid item xs={9}>
          <Typography variant="body1">{data?.name}</Typography>
          <Typography variant="body2">{data?.description}</Typography>
          <Box>
            {orderBuildData?.products &&
              orderBuildData?.products.map((product) => {
                return (
                  <Stack direction="row" spacing={1} key={product.id}>
                    <Typography variant="caption">{`${product?.categoryName}: `}</Typography>
                    <Typography variant="caption">{`${product?.name}`}</Typography>
                  </Stack>
                );
              })}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box width="100%">
            <Typography variant="body2" textAlign="end">
              RM {numberWithCommas(totalPriceMemo)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}

export default PaymentBuildProduct;
