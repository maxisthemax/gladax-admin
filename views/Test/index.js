//*lodash

//*components
import { DyanmicTable } from "components/Table";

//*material-ui

//*assets

//*redux

//*utils

//*helpers

//*styles

//*custom components

function Test() {
  //*define

  //*states

  //*const
  const columnsData = [
    {
      field: "dataBoolean",
      headerName: "Boolean",
      type: "boolean",
      editable: true,
    },
    {
      field: "dataNumber",
      headerName: "number",
      type: "number",
      editable: true,
    },
    { field: "dataDate", headerName: "Date", type: "dateTime", editable: true },
    {
      field: "dataString",
      headerName: "String",
      type: "string",
      editable: true,
    },
  ];

  //*let

  //*ref

  //*useEffect

  //*functions

  return <DyanmicTable tableName="dummy" columnsData={columnsData} />;
}

export default Test;
