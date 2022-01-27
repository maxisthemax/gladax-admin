import { useState, useEffect, useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import { unflatten, flatten } from "flat";
import { reactLocalStorage } from "reactjs-localstorage";
import convertUnit from "convert-units";
import moment from "moment";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { useDrawer } from "components/Drawers";

//*lodash
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import times from "lodash/times";
import pull from "lodash/pull";
import uniq from "lodash/uniq";
import includes from "lodash/includes";
import forOwn from "lodash/forOwn";
import isEmpty from "lodash/isEmpty";

//*components
import { CustomIcon } from "components/Icons";
import { DataGridTable } from "components/Table";
import { Button } from "components/Buttons";
import Payment from "./Payment";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";

//*assets

//*redux

//*utils
import { orderStatus } from "utils/constant";
import axios from "utils/http-anxios";

//*helpers
import { getAllPastMonths } from "helpers/dateHelpers";

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*custom components
const ISSERVER = typeof window === "undefined";

function Orders() {
  //*define
  const { Drawer, handleOpenDrawer } = useDrawer();
  const {
    data,
    isValidating,
    error,
    mutate: mutateAllOrders,
  } = useSwrHttp("order/admin", {
    fallbackData: [],
  });
  //*define
  const { data: deliveryData } = useSwrHttp("delivery", {
    fallbackData: [],
  });

  const { enqueueSnackbar } = useSnackbar();
  //*const
  const startYear = 2022;
  const thisYear = moment(new Date()).year();
  const thisMonth = moment(new Date()).month() + 1;

  const arrayOfTotalYear = times(thisYear - startYear + 1).reduce(
    (temp, value) => {
      temp.push(startYear + value);
      return temp;
    },
    []
  );

  //*states
  const [orderId, setOrderId] = useState("");
  const [editedData, setEditedData] = useState({});
  const [selectedYear, setSelectYear] = useState(thisYear);
  const [selectedMonth, setSelectMonth] = useState(
    getAllPastMonths(new Date(`1/1/${selectedYear}`))
  );

  const lookupState = ISSERVER
    ? {}
    : reactLocalStorage.getObject("delivery_TableLookupHide");

  //*useMemo
  const flatData = useMemo(
    () =>
      data.reduce((temp, value) => {
        const createdYear = moment(value.createdAt).year();
        const createdMonth =
          moment.monthsShort()[moment(value.createdAt).month()];

        if (
          selectedYear === createdYear &&
          includes(selectedMonth, createdMonth)
        ) {
          temp.push(flatten(value));
          return temp;
        }
      }, []),
    [data, selectedYear, selectedMonth]
  );

  const RenderCell = ({ field, formattedValue, api, id, value, row }) => {
    const isEdited = has(editedData, `${id}.${field}`);
    const findData = find(flatData, { id: id }) || "";
    const handleClickUndoButton = () => {
      handleUndoEditData(id, field);
      api.setEditCellValue({ id, field, value: findData[`${field}`] });
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, "view");
    };
    let text = "";
    switch (field) {
      case "id":
        text = (
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              handleOpenDrawer();
              setOrderId(value);
            }}
          >
            {value}
          </Box>
        );
        break;
      case "totalAmount":
        text = `RM ${formattedValue}`;
        break;
      case "totalWeight":
        text = `${convertUnit(value).from("g").to("kg")} kg`;
        break;
      case "deliveryId":
        {
          const findDeliveryData = find(deliveryData, { id: value });
          text = findDeliveryData?.vendor;
        }
        break;
      case "status": {
        const findStatus = find(orderStatus, { valueNumber: value });
        text = (
          <Box p={1}>
            {`${findStatus.label} ${
              row[`statuesDate.${findStatus.valueName}`]
                ? moment(row[`statuesDate.${findStatus.valueName}`]).format(
                    "DD/MM/YYYY"
                  )
                : ""
            }`}
            <Box>
              {/* <a href="#" onClick={() => handleToStatus("revert", id, value)}>
                Revert
              </a>{" "} */}
              {findStatus.valueNumber < 5 && (
                <a href="#" onClick={() => handleToStatus("next", id, value)}>
                  Next
                </a>
              )}
            </Box>
          </Box>
        );
        break;
      }
      case "allStatus":
        text = (
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button
                  variant="contained"
                  size="small"
                  {...bindTrigger(popupState)}
                >
                  Check Status
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Box p={1} width="300px">
                    <List dense disablePadding>
                      {orderStatus.map(({ label, valueName, valueNumber }) => {
                        if (row.status < valueNumber) return "";
                        else
                          return (
                            <ListItem disableGutters>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                color={
                                  row.status === valueNumber
                                    ? "darkblue"
                                    : "inherit"
                                }
                                sx={{
                                  fontWeight:
                                    row.status === valueNumber ? "bold" : "",
                                }}
                              >
                                <Box>{label}</Box>
                                <Box>
                                  {row[`statuesDate.${valueName}`]
                                    ? moment(
                                        row[`statuesDate.${valueName}`]
                                      ).format("DD/MM/YYYY")
                                    : ""}
                                </Box>
                              </Box>
                            </ListItem>
                          );
                      })}
                    </List>
                  </Box>
                </Popover>
              </div>
            )}
          </PopupState>
        );
        break;
      default:
        text = formattedValue;
        break;
    }
    return (
      <Box
        bgcolor={isEdited ? "#ff943975" : "inherit"}
        width={isEdited ? "100%" : "auto"}
      >
        <Box display="flex" justifyContent="space-between">
          <Box
            textOverflow="ellipsis"
            overflow="hidden"
            pl={2}
            pr={2}
            sx={{ placeSelf: "center" }}
          >
            {text}
          </Box>
          {isEdited && (
            <Box>
              <IconButton size="small" onClick={handleClickUndoButton}>
                <CustomIcon size="small" icon="undo" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const RenderEditStringCell = ({ id, field, api, value }) => {
    const cellElement = api.getCellElement(id, field);
    const anchor = cellElement.getBoundingClientRect();

    return (
      <Box>
        <Popover
          anchorReference="anchorPosition"
          keepMounted={false}
          open={true}
          onClose={() => {
            const stringValue = document.getElementById(
              `${id}${field}_string`
            ).value;
            api.setEditCellValue({ id, field, value: stringValue });
            api.commitCellChange({ id, field });
            api.setCellMode(id, field, "view");

            handleEditCell({ field, id, value: stringValue });
          }}
          anchorPosition={{ top: anchor.top, left: anchor.left }}
        >
          <Box sx={{ width: "300px" }}>
            <TextField
              id={`${id}${field}_string`}
              fullWidth
              multiline
              rows={4}
              defaultValue={value}
            />
          </Box>
        </Popover>
      </Box>
    );
  };

  const RenderEditDeliveryCell = ({ id, field, api, value }) => {
    const cellElement = api.getCellElement(id, field);
    const anchor = cellElement.getBoundingClientRect();

    const submit = (selectValue) => {
      api.setEditCellValue({ id, field, value: selectValue });
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, "view");

      handleEditCell({ field, id, value: selectValue });
    };

    return (
      <Box>
        <Popover
          anchorReference="anchorPosition"
          keepMounted={false}
          open={true}
          anchorPosition={{ top: anchor.top, left: anchor.left }}
        >
          <Box sx={{ width: "300px" }}>
            <List>
              {deliveryData.map((delivery) => {
                return (
                  <ListItemButton
                    onClick={() => submit(delivery.id)}
                    selected={value === delivery.id}
                  >
                    {delivery.vendor}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Popover>
      </Box>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "Order Id.",
      type: "string",
      editable: false,
      width: 300,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["id"],
    },
    {
      field: "status",
      headerName: "Current Status",
      type: "string",
      editable: false,
      width: 150,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["status"],
    },
    {
      field: "allStatus",
      headerName: "Status History",
      type: "string",
      editable: false,
      width: 150,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["status"],
    },
    {
      field: "deliveryId",
      type: "string",
      width: 120,
      editable: true,
      renderCell: RenderCell,
      renderEditCell: RenderEditDeliveryCell,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "date",
      editable: false,
      width: 160,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["createdAt"],
    },
    {
      field: "recipient",
      headerName: "Recipient Name",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      hide: lookupState["recipient"],
    },
    {
      field: "recipientPhoneNo",
      headerName: "Recipient Phone No.",
      type: "string",
      editable: true,
      width: 220,
      renderCell: RenderCell,
      hide: lookupState["recipientPhoneNo"],
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      type: "number",
      editable: false,
      width: 120,
      renderCell: RenderCell,
      hide: lookupState["totalAmount"],
    },
    {
      field: "totalWeight",
      headerName: "Total Weight",
      type: "number",
      editable: false,
      width: 120,
      renderCell: RenderCell,
      hide: lookupState["totalWeight"],
    },
    {
      field: "deliveryAddress.address1",
      headerName: "Address 1",
      type: "string",
      editable: true,
      width: 200,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.address1"],
    },
    {
      field: "deliveryAddress.address2",
      headerName: "Address 2",
      type: "string",
      editable: true,
      width: 200,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.address2"],
    },
    {
      field: "deliveryAddress.city",
      headerName: "City",
      type: "string",
      editable: true,
      width: 150,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.city"],
    },
    {
      field: "deliveryAddress.state",
      headerName: "State",
      type: "string",
      editable: true,
      width: 150,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.state"],
    },
    {
      field: "deliveryAddress.postCode",
      headerName: "Postcode",
      type: "string",
      editable: true,
      width: 150,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.postCode"],
    },
    {
      field: "deliveryAddress.country",
      headerName: "Country",
      type: "string",
      editable: true,
      width: 150,
      renderCell: RenderCell,
      hide: lookupState["deliveryAddress.country"],
    },
  ];

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (!isValidating)
      if (error?.response) {
        const errorMessage = error.response.statusText;
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
  }, [enqueueSnackbar, error, isValidating]);

  //*functions
  const handleToStatus = async (mode, orderId, currentStatus) => {
    let status = mode === "next" ? currentStatus + 1 : currentStatus - 1;
    try {
      const resData = await axios.patch(
        `order/updateStatus/${orderId}/${status}`
      );
      mutateAllOrders();
      enqueueSnackbar(resData.statusText, {
        variant: "success",
      });
    } catch (eror) {
      enqueueSnackbar(eror?.response?.statusText, {
        variant: "error",
      });
    }
  };

  const handleSetSelectYear = (year) => {
    setSelectYear(year);
  };

  const handleSetSelectMonth = (month) => {
    setSelectMonth((selectedMonth) => {
      if (includes(selectedMonth, month)) {
        const newSelectedMonth = [...pull(selectedMonth, month)];

        return newSelectedMonth;
      } else {
        const newSelectedMonth = uniq([...selectedMonth, month]);
        return newSelectedMonth;
      }
    });
  };

  const handleEditCell = useCallback(
    (editData) => {
      const { field, value, id } = editData;

      const findData = find(flatData, { id: id }) || "";

      if (trim(value) !== trim(findData[`${field}`])) {
        setEditedData({ ...editedData, [`${id}.${field}`]: value });
      } else {
        setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
      }
    },
    [flatData, editedData]
  );
  const handleUndoEditData = useCallback(
    (id, field) => {
      setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
    },
    [editedData]
  );

  const handleSaveAll = useCallback(async () => {
    const unflatEditData = unflatten(editedData);
    const allPromises = [];
    forOwn(unflatEditData, (data, key) => {
      allPromises.push(axios.patch(`order/${key}`, data));
    });
    const resData = await Promise.allSettled(allPromises);
    resData.forEach(({ status, value, reason }) => {
      if (status === "fulfilled")
        enqueueSnackbar(value.statusText, {
          variant: "success",
        });
      else
        enqueueSnackbar(reason.response.data.message, {
          variant: "error",
        });
    });
    mutateAllOrders();
    setEditedData({});
  }, [editedData]);

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          {!isEmpty(editedData) && (
            <Button
              onClick={handleSaveAll}
              startIcon={<CustomIcon icon="save" color="white" />}
            >
              Save
            </Button>
          )}
          <Box pb={2}></Box>
          <Box pb={1}>
            <Typography gutterBottom>Year Month Filter</Typography>
            <Stack direction="row" spacing={1}>
              {arrayOfTotalYear &&
                arrayOfTotalYear.map((year) => (
                  <Chip
                    key={year}
                    color={selectedYear === year ? "primary" : "default"}
                    label={year}
                    onClick={() => {
                      handleSetSelectYear(year);
                    }}
                  />
                ))}
            </Stack>
          </Box>
          <Box pb={2}>
            <Stack direction="row" spacing={1}>
              {getAllPastMonths(
                new Date(
                  `${
                    selectedYear === thisYear ? thisMonth : "12"
                  }/1/${selectedYear}`
                )
              ).map((month) => (
                <Chip
                  key={month}
                  color={includes(selectedMonth, month) ? "primary" : "default"}
                  label={month}
                  onClick={() => {
                    handleSetSelectMonth(month);
                  }}
                />
              ))}
            </Stack>
          </Box>
          {flatData && flatData.length > 0 && (
            <DataGridTable
              rowHeight={70}
              id="orders"
              isValidating={isValidating}
              data={flatData}
              columns={columns}
              checkboxSelection={false}
              handleEditCell={handleEditCell}
            />
          )}
        </Box>
      </Box>
      <Drawer size={8}>
        <Box p={4}>
          <Payment orderId={orderId} />
        </Box>
      </Drawer>
    </Box>
  );
}

export default Orders;
