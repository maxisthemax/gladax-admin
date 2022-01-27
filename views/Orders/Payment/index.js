import { useMemo } from "react";
import moment from "moment";
import useSwrHttp from "useHooks/useSwrHttp";

//*lodash
import groupBy from "lodash/groupBy";
import forOwn from "lodash/forOwn";

//*components
import PaymentSummary from "./PaymentSummary";
import { CustomIcon } from "components/Icons";

//*material-ui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

//*assets

//*redux

//*validation

//*helpers

//*utils
import { orderStatus } from "utils/constant";

//*style

//*custom components

function Payment({ orderId }) {
  //*define
  const { data: orderData } = useSwrHttp(orderId ? `order/${orderId}` : ``, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
  });

  //*const
  const deliveryAddress = orderData?.deliveryAddress;
  const recipient = orderData?.recipient;
  const recipientPhoneNo = orderData?.recipientPhoneNo;
  const delivery = orderData?.delivery;
  const orderProducts = groupBy(orderData?.orderProducts, "buildId");
  const totalAmount = orderData?.totalAmount;
  const status = orderData?.status;

  //*let

  //*ref

  //*useEffect

  //*functions

  //*useMemo
  const orderProductsMemo = useMemo(() => {
    let newOrderProducts = [];
    forOwn(orderProducts, (value, key) => {
      newOrderProducts.push({ buildId: key, products: value });
    });
    return newOrderProducts;
  }, [orderProducts]);

  return orderData ? (
    <Box>
      <Box p={2} />
      <Box display="flex" justifyContent="center">
        <Grid container justifyContent="center" maxWidth="1500px" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">Order ID : {orderId}</Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid
            container
            item
            xs={12}
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12}>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            {orderStatus.map(({ icon, valueNumber, valueName, label }) => {
              const statusDate = orderData?.statuesDate[valueName];

              return (
                <Grid key={valueNumber} item xs={12} sm={4} md={4} lg={2}>
                  <Box
                    key={valueNumber}
                    display="flex"
                    color={
                      status >= valueNumber
                        ? status === valueNumber
                          ? "black"
                          : "#777777"
                        : "lightgrey"
                    }
                  >
                    <CustomIcon
                      size="large"
                      icon={icon}
                      variant="outlined"
                      color="inherit"
                    />
                    <Box p={1}></Box>
                    <Box display="grid">
                      <Typography variant="caption" color="inherit">
                        {label}
                      </Typography>
                      <Typography variant="caption" color="inherit">
                        {statusDate
                          ? moment(statusDate).format("DD/MM/YYYY")
                          : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Divider sx={{ mt: 1 }} />
            </Grid>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12} sm={7} pr={6}>
            <Stack spacing={2}>
              <Box width="100%">
                <Typography variant="h5">Shipping Address</Typography>
                <Box p={1}></Box>
                <Typography>{recipient}</Typography>
                <Typography>{recipientPhoneNo}</Typography>
                <Typography>{deliveryAddress.address1}</Typography>
                <Typography>{deliveryAddress.address2}</Typography>
                <Typography>
                  {deliveryAddress.postCode}, {deliveryAddress.city},{" "}
                  {deliveryAddress.state}
                </Typography>
                <Typography>{deliveryAddress.country}</Typography>
              </Box>
              <Divider />
              <Box width="100%">
                <Typography variant="h5">Delivery</Typography>
                <Box p={1}></Box>
                <Typography>
                  {delivery.vendor} - {delivery.desc} RM {delivery.price}
                </Typography>
              </Box>
              <Divider />
              <Box width="100%">
                <Typography variant="h5">Payment</Typography>
                <Box p={1}></Box>
                <Typography>Razer Pay FPX</Typography>
              </Box>
              <Divider />
              <Box width="100%">
                <Typography variant="h5">Billing Address</Typography>
                <Box p={1}></Box>
                <Typography>Same As Shipping</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5}>
            <PaymentSummary
              totalAmount={totalAmount}
              orderProducts={orderProductsMemo}
              delivery={delivery}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <div></div>
  );
}

export default Payment;
