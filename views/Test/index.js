import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";

//*lodash
import has from "lodash/has";

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

//*assets

//*redux

//*utils

//*helpers
import axios from "utils/http-anxios";
import useSwrHttp from "utils/useSwrHttp";

//*styles
const useStyles = makeStyles({
  root: {
    "& .cold": {
      backgroundColor: "#b9d5ff91",
      color: "#1a3e72",
    },
    "& .hot": {
      backgroundColor: "#ff943975",
      color: "#1a3e72",
    },
  },
});

//*custom components

function Test() {
  //*define
  const classes = useStyles();
  const { data, mutate, isValidating } = useSwrHttp("dummy");
  const { enqueueSnackbar } = useSnackbar();

  //*states
  const [editedData, setEditedData] = useState({});

  //*const
  const columns = [
    {
      field: "dataBoolean",
      headerName: "Boolean",
      type: "boolean",
      editable: true,
    },
    {
      field: "dataDate",
      headerName: "Date",
      type: "dateTime",
      width: 240,
      editable: true,
    },
    {
      field: "dataString",
      headerName: "String",
      type: "string",
      flex: 1,
      minWidth: 300,
      editable: true,
    },
  ];

  //*let

  //*ref

  //*useEffect

  //*functions
  const handleAddNewDummy = async () => {
    const newData = {
      dataBoolean: true,
      dataDate: null,
      dataString: "",
    };

    try {
      const post = await axios.post("dummy", newData);
      mutate([post.data, ...data], false);
    } catch ({ response }) {
      const errorMessage = response.data.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  const handleEditNewDummy = (editData) => {
    const { row, field, value, id } = editData;
    const rowData = row[field];
    if (rowData !== editData[`${id}.${field}`])
      setEditedData({ ...editedData, [`${id}.${field}`]: value });
  };

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }} className={classes.root}>
          <Box pb={2}>
            <Button
              onClick={handleAddNewDummy}
              size="small"
              variant="contained"
              startIcon={<CustomIcon icon="add" color="white" />}
            >
              New
            </Button>
          </Box>
          {data && data.length > 0 && (
            <DataGrid
              autoHeight
              loading={isValidating}
              autoPageSize
              rows={data}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              density="compact"
              onCellEditCommit={handleEditNewDummy}
              getCellClassName={(params) => {
                if (has(editedData, `${params.id}.${params.field}`)) {
                  return "hot";
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Test;
