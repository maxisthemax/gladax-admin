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

function Users() {
  //*define

  //*states

  //*const
  const columnsData = [
    {
      field: "email",
      headerName: "Email",
      type: "string",
      editable: true,
    },
    {
      field: "firstName",
      headerName: "First Name",
      type: "number",
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      type: "number",
      editable: true,
    },
  ];

  //*let

  //*ref

  //*useEffect

  //*functions

  return <DyanmicTable tableName="user" columnsData={columnsData} />;
}

export default Users;
