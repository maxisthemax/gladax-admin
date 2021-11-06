import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { unflatten } from "flat";
import { reactLocalStorage } from "reactjs-localstorage";
import { Form } from "react-final-form";
import { Select, DatePicker } from "mui-rff";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

//*lodash
import map from "lodash/map";
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import forOwn from "lodash/forOwn";
import isEmpty from "lodash/isEmpty";

//*components
import { TextFieldForm } from "components/Form";
import { LightTooltip } from "components/Tooltip";
import { CustomIcon } from "components/Icons";
import { DataGridTable } from "components/Table";
import { Button } from "components/Buttons";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*helpers

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*validation
import { addNewProduct } from "validation";

//*custom components
const ISSERVER = typeof window === "undefined";

function ProductTable() {
  //*define
  const { data, mutate, isValidating, error } = useSwrHttp("product", {
    fallbackData: [],
  });
  const { data: categoryData } = useSwrHttp("category", {
    fallbackData: [],
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  //*states
  const [editedData, setEditedData] = useState({});

  //*const

  const lookupState = ISSERVER
    ? {}
    : reactLocalStorage.getObject("product_TableLookupHide");

  const RenderCell = ({ field, formattedValue, api, id }) => {
    const isEdited = has(editedData, `${id}.${field}`);
    const findData = find(data, { id: id }) || "";
    const handleClickUndoButton = () => {
      handleUndoEditData(id, field);
      api.setEditCellValue({ id, field, value: findData[`${field}`] });
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, "view");
    };
    const cellElement = api.getCellElement(id, field);
    return (
      <LightTooltip
        placement="bottom-start"
        title={formattedValue ? formattedValue : ""}
        disableHoverListener={
          cellElement?.scrollWidth <= cellElement?.clientWidth
        }
      >
        <Box
          bgcolor={isEdited ? "#ff943975" : "inherit"}
          width={isEdited ? "100%" : "auto"}
        >
          <Box display="flex" justifyContent="space-between">
            <Box textOverflow="ellipsis" overflow="hidden" pl={2} pr={2}>
              {formattedValue}
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
      </LightTooltip>
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
          open={open}
          onClose={() => {
            const stringValue = document.getElementById(
              `${id}${field}_string`
            ).value;
            api.setEditCellValue({ id, field, value: stringValue }, event);
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

  const columns = [
    {
      field: "name",
      headerName: "Name",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      hide: lookupState["name"],
    },
    {
      field: "categoryId",
      headerName: "Category",
      type: "singleSelect",
      editable: true,
      width: 200,
      valueOptions: map(categoryData, "id"),
      valueFormatter: ({ value }) => {
        return find(categoryData, { id: value })?.name;
      },
      renderCell: RenderCell,
      hide: lookupState["category"],
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["description"],
    },
    {
      field: "dimension",
      headerName: "Dimension",
      type: "number",
      editable: true,
      width: 100,
      renderCell: RenderCell,
      hide: lookupState["description"],
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      editable: true,
      width: 100,
      renderCell: RenderCell,
      hide: lookupState["weight"],
    },
    {
      field: "sku",
      headerName: "SKU",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      hide: lookupState["name"],
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: true,
      width: 100,
      renderCell: RenderCell,
      hide: lookupState["quantity"],
    },
    {
      field: "availableDate",
      headerName: "AvailableDate",
      type: "date",
      editable: true,
      width: 160,
      renderCell: RenderCell,
      hide: lookupState["availableDate"],
    },
    {
      field: "productStatus",
      headerName: "Product Status",
      type: "string",
      editable: true,
      width: 160,
      renderCell: RenderCell,
      hide: lookupState["productStatus"],
    },
    {
      field: "stockStatus",
      headerName: "Stock Status",
      type: "string",
      editable: true,
      width: 160,
      renderCell: RenderCell,
      hide: lookupState["stockStatus"],
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      editable: true,
      width: 160,
      renderCell: RenderCell,
      hide: lookupState["price"],
    },
  ];

  const initialValues = {
    dimension: 0,
    weight: 0,
    quantity: 0,
    availableDate: new Date(),
    sku: "",
    stockStatus: "",
    productStatus: "",
    price: 0,
  };

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
  const handleEditCell = useCallback(
    (editData) => {
      const { field, value, id } = editData;
      const findData = find(data, { id: id }) || "";
      if (trim(value) !== trim(findData[`${field}`])) {
        setEditedData({ ...editedData, [`${id}.${field}`]: value });
      } else {
        setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
      }
    },
    [data, editedData]
  );

  const handleUndoEditData = useCallback(
    (id, field) => {
      setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
    },
    [editedData]
  );

  const onSubmit = async (value) => {
    try {
      const resData = await axios.post("product", value);
      mutate();
      enqueueSnackbar(resData.statusText, {
        variant: "success",
      });
    } catch (eror) {
      let errorMessage = "";
      if (Array.isArray(eror.response.data.message)) {
        errorMessage = (
          <ul>
            {eror.response.data.message.map((message) => (
              <li>{message}</li>
            ))}
          </ul>
        );
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(eror.response.data.message, {
          variant: "error",
        });
      }
    }
  };

  const handleSaveAll = useCallback(async () => {
    const unflatEditData = unflatten(editedData);
    const allPromises = [];
    forOwn(unflatEditData, (data, key) => {
      allPromises.push(axios.patch(`product/${key}`, data));
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

    setEditedData({});
  }, [editedData]);

  const handleDelete = useCallback(async () => {
    const allPromises = [];
    selectionModel.forEach((key) =>
      allPromises.push(axios.delete(`product/${key}`))
    );
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
    setEditedData({});
    mutate();
  }, [selectionModel]);

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={addNewProduct}
            render={({ handleSubmit, invalid, form: { restart } }) => {
              return (
                <form
                  id="addNewProductForm"
                  onSubmit={(e) => handleSubmit(e).then(restart)}
                  noValidate
                >
                  <Stack spacing={1} direction="column">
                    <Stack spacing={1} direction="row">
                      <TextFieldForm label="Name" name="name" required={true} />
                      <Select name="categoryId" label="Select a Category">
                        {categoryData &&
                          categoryData.map((data) => {
                            return (
                              <MenuItem value={data.id}>{data.name}</MenuItem>
                            );
                          })}
                      </Select>
                      <TextFieldForm label="Description" name="description" />
                    </Stack>
                    <Stack spacing={2} direction="row">
                      <TextFieldForm
                        label="Dimension"
                        name="dimension"
                        type="number"
                      />
                      <TextFieldForm
                        label="Weight"
                        name="weight"
                        type="number"
                      />
                      <TextFieldForm label="SKU" name="sku" />
                      <TextFieldForm
                        label="Quantity"
                        name="quantity"
                        type="number"
                      />
                    </Stack>
                    <Stack spacing={1} direction="row">
                      <DatePicker
                        label="Available Date"
                        name="availableDate"
                        required={true}
                        dateFunsUtils={DateFnsUtils}
                      />
                      <TextFieldForm
                        label="Product Status"
                        name="productStatus"
                      />
                      <TextFieldForm label="Stock Status" name="stockStatus" />
                      <TextFieldForm label="Price" name="price" type="number" />
                    </Stack>
                  </Stack>
                  <Box p={1} />
                  <Button disabled={invalid} type="submit">
                    Create
                  </Button>
                </form>
              );
            }}
          />
          <Box pb={2}></Box>
          <Divider />
          <Box pb={2}></Box>
          {!isEmpty(editedData) && (
            <Button
              onClick={handleSaveAll}
              startIcon={<CustomIcon icon="save" color="white" />}
            >
              Save
            </Button>
          )}
          {!isEmpty(selectionModel) && (
            <Button
              onClick={handleDelete}
              startIcon={<CustomIcon icon="save" color="white" />}
            >
              Delete {`(${selectionModel.length})`}
            </Button>
          )}
          <Box pb={2}></Box>
          <DataGridTable
            sortModel={{
              field: "name",
              sort: "asc",
            }}
            id="product"
            isValidating={isValidating}
            data={data}
            columns={columns}
            selectionModel={selectionModel}
            setSelectionModel={setSelectionModel}
            handleEditCell={handleEditCell}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ProductTable;
