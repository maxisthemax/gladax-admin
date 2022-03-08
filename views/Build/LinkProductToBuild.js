import { useMemo } from "react";
import { useCallback, useRef } from "react";
import { Form } from "react-final-form";
import useHover from "@react-hook/hover";
import { DatePicker } from "mui-rff";
import DateFnsUtils from "@date-io/date-fns";

//*lodash
import groupBy from "lodash/groupBy";
import find from "lodash/find";
import filter from "lodash/filter";
import uniq from "lodash/uniq";
import map from "lodash/map";

//*components
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import useUploadAttachment from "components/useUploadAttachment";
import { CustomIcon } from "components/Icons";
import { useDialog } from "components/Dialogs";

//*material-ui
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LinearProgress from "@mui/material/LinearProgress";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*helpers

//*styles

//*validation
import { createNewBuild } from "validation";

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*custom components
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
function LinkProductToBuild({
  id,
  weight,
  name,
  description,
  properties,
  documents,
  categories,
  startDate,
  endDate,
}) {
  //*define
  const {
    Dialog: DialogConfirm,
    handleOpenDialog: handleOpenDialogDeleteConfirm,
    handleCloseDialog: handleCloseDialogDelteConfirm,
  } = useDialog();
  const { startUpload, uploadAttachment } = useUploadAttachment(
    6 - documents.length,
    false
  );

  const { mutate } = useSwrHttp(`build`, {
    fallbackData: [],
  });
  const { data: productData } = useSwrHttp("product", {
    fallbackData: [],
  });
  const { data: categoryData } = useSwrHttp("category", {
    fallbackData: [],
  });

  //*states

  //*const
  const productGroupByCategory = groupBy(productData, "categoryId");

  //*useMemo
  const useMemoCategory = useMemo(() => {
    let data = {};
    categories.forEach((category) => {
      data[`${category.id}`] = [];
      category.products.forEach((product) => {
        data[`${category.id}`].push({
          productId: product.id,
          discountedPrice: product.discountedPrice,
        });
      });
    });

    return data;
  }, [categories]);

  const useBuildProductData = useMemo(() => {
    let data = {};
    categories.forEach((category) => {
      data[`${category.id}`] = [];
      category.products.forEach((product) => {
        data[`${category.id}`].push(product.id);
      });
    });
    return data;
  }, [categories]);

  //*let

  //*ref

  //*useEffect

  //*functions
  const onSubmitSaveBuildData = async (values) => {
    const resData = await startUpload();
    const uploadedDocumentIdArray = map(resData, "value.data.id");
    const currentDocumentIdArray = map(documents, "id");
    const { name, description, tags, weight, startDate, endDate } = values;

    await axios.patch(`build/${id}`, {
      name: name,
      description: description,
      tags: tags?.split(","),
      weight: weight,
      startDate: startDate,
      endDate: endDate,
      documentIds: uniq([
        ...currentDocumentIdArray,
        ...uploadedDocumentIdArray,
      ]),
    });
    mutate();
  };

  const onSubmitProductData = async (values) => {
    const { data } = values;
    await axios.post(`build-product/${id}`, {
      buildProducts: uniq(Object.values(data).flat()),
    });
    mutate();
  };

  const handleRemoveDocumentId = useCallback(
    async (documentId) => {
      const newDocumentArray = [
        ...filter(documents, (document) => {
          return document.id !== documentId;
        }),
      ];
      await axios.patch(`build/${id}`, {
        documentIds: uniq(map(newDocumentArray, "id")),
      });
      mutate();
    },
    [documents, id]
  );

  const handleDelete = async () => {
    await axios.delete(`build/${id}`);
    mutate();
    handleCloseDialogDelteConfirm();
  };

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Form
            initialValues={{
              name: name,
              description: description,
              tags: properties.tags.join(","),
              weight: weight,
              startDate: startDate,
              endDate: endDate,
            }}
            onSubmit={onSubmitSaveBuildData}
            validate={createNewBuild}
            render={({
              handleSubmit,
              invalid,
              form: { restart },
              submitting,
            }) => {
              return (
                <form
                  id="addNewBuild"
                  onSubmit={(e) => handleSubmit(e)?.then(restart)}
                  noValidate
                >
                  <Stack spacing={1} direction="column" flexWrap>
                    <TextFieldForm
                      label="Name"
                      name="name"
                      required={true}
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Description"
                      name="description"
                      required={true}
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Tags"
                      name="tags"
                      required={true}
                      disabled={submitting}
                    />
                    <TextFieldForm
                      label="Weight (gram)"
                      name="weight"
                      type="number"
                      required={true}
                      disabled={submitting}
                    />
                    <DatePicker
                      label="Start Date"
                      name="startDate"
                      required={true}
                      dateFunsUtils={DateFnsUtils}
                    />
                    <DatePicker
                      label="End Date"
                      name="endDate"
                      required={true}
                      dateFunsUtils={DateFnsUtils}
                    />
                  </Stack>
                  <Box p={1} />
                  <Grid container>
                    {[...documents] &&
                      [...documents].map((document) => {
                        return (
                          <ImageUpload
                            document={document}
                            handleRemoveDocumentId={handleRemoveDocumentId}
                          />
                        );
                      })}
                  </Grid>
                  {documents.length < 6 && uploadAttachment}
                  <Button disabled={invalid} type="submit">
                    Save
                  </Button>
                </form>
              );
            }}
          />
          <Box p={2} />
          <Form
            initialValues={{ data: useMemoCategory }}
            onSubmit={onSubmitProductData}
            render={({
              handleSubmit,
              invalid,
              form: { restart, change },
              values,
              submitting,
            }) => {
              return (
                <form
                  id="addNewBuild"
                  onSubmit={(e) => handleSubmit(e)?.then(restart)}
                  noValidate
                >
                  <Stack spacing={1} direction="column" flexWrap>
                    <Box>
                      {categoryData?.map((data) => {
                        const categoryId = data.id;
                        const newOptionData = productGroupByCategory[
                          categoryId
                        ]?.reduce((temp, value) => {
                          temp.push(value.id);
                          return temp;
                        }, []);

                        const defaultValueData =
                          useBuildProductData[categoryId];

                        if (newOptionData)
                          return (
                            <>
                              {submitting && <LinearProgress />}
                              <Paper sx={{ padding: 1 }}>
                                <Autocomplete
                                  disabled={submitting}
                                  multiple
                                  id="checkboxes-tags-demo"
                                  options={newOptionData}
                                  disableCloseOnSelect
                                  getOptionLabel={(option) => {
                                    const data = find(
                                      productGroupByCategory[categoryId],
                                      {
                                        id: option,
                                      }
                                    );

                                    return data?.name;
                                  }}
                                  onChange={(e, value) => {
                                    const newValue = value.reduce(
                                      (temp, dataId) => {
                                        const data = find(
                                          values.data[categoryId],
                                          { productId: dataId }
                                        );
                                        const findProduct = find(productData, {
                                          id: dataId,
                                        });
                                        temp.push({
                                          productId: dataId,
                                          discountedPrice: data?.discountedPrice
                                            ? data?.discountedPrice
                                            : findProduct.price,
                                        });

                                        return temp;
                                      },
                                      []
                                    );
                                    change(`data.${categoryId}`, newValue);
                                  }}
                                  renderOption={(
                                    props,
                                    option,
                                    { selected }
                                  ) => {
                                    const data = find(
                                      productGroupByCategory[categoryId],
                                      {
                                        id: option,
                                      }
                                    );
                                    return (
                                      <li {...props}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          style={{ marginRight: 8 }}
                                          checked={selected}
                                        />
                                        {`${data.name} - RM ${data.price}`}
                                      </li>
                                    );
                                  }}
                                  defaultValue={defaultValueData}
                                  renderInput={(params) => (
                                    <TextField {...params} label={data.name} />
                                  )}
                                />
                                <Box p={1} />
                                <Grid container spacing={2}>
                                  {values?.data &&
                                    values?.data[data.id] &&
                                    values?.data[data.id].map(
                                      (value, index) => {
                                        const findProduct = find(productData, {
                                          id: value.productId,
                                        });
                                        return (
                                          <Grid item xs={12}>
                                            <Typography gutterBottom>
                                              Name: {findProduct?.name}
                                            </Typography>
                                            <Typography gutterBottom>
                                              Original Price :{" "}
                                              {`RM ${findProduct?.price}`}
                                            </Typography>
                                            <Checkbox
                                              checked={
                                                values?.data[data.id][index]
                                                  ?.discountedPrice
                                              }
                                              onChange={(event) => {
                                                if (!event.target.checked) {
                                                  change(
                                                    `data.${data.id}.${index}.discountedPrice`,
                                                    null
                                                  );
                                                } else {
                                                  change(
                                                    `data.${data.id}.${index}.discountedPrice`,
                                                    findProduct?.price
                                                  );
                                                }
                                              }}
                                            />

                                            <TextFieldForm
                                              autoZero={false}
                                              disabled={submitting}
                                              size="small"
                                              fullWidth={false}
                                              label="Discounted Price"
                                              type="number"
                                              name={`data.${data.id}.${index}.discountedPrice`}
                                            />
                                          </Grid>
                                        );
                                      }
                                    )}
                                </Grid>
                              </Paper>
                              <Box p={0.5} />
                            </>
                          );
                      })}
                    </Box>
                  </Stack>
                  <Box p={1} />
                  <Button disabled={invalid} type="submit">
                    Save
                  </Button>
                  <Box p={1} />
                  <Button onClick={handleOpenDialogDeleteConfirm}>
                    Delete
                  </Button>
                </form>
              );
            }}
          />
        </Box>
      </Box>
      <DialogConfirm title="Confirm Delete" handleOk={handleDelete}>
        <p>You want to delete?</p>
      </DialogConfirm>
    </Box>
  );
}

function ImageUpload({ document, handleRemoveDocumentId }) {
  const target = useRef(null);
  const isHovering = useHover(target, { enterDelay: 200, leaveDelay: 200 });

  return (
    <Grid item xs={4} ref={target}>
      <Box p={1}>
        <Box position="absolute" p={1}>
          {isHovering && (
            <Fab
              size="small"
              color="primary"
              onClick={() => {
                handleRemoveDocumentId(document.id);
              }}
            >
              <CustomIcon icon="delete" color="white" size="small" />
            </Fab>
          )}
        </Box>
        <img src={document.url} alt={document.id} width="100%" />
      </Box>
    </Grid>
  );
}
export default LinkProductToBuild;
