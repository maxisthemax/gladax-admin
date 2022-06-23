import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import { arrayMoveImmutable } from "array-move";

//lodash

//components
import { CustomIcon } from "./Icons";

//material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import axios from "utils/http-anxios";
import { LinearProgress } from "@mui/material";

//material-icons

//helpers

//utils

//redux

//assets

//styles

function useUploadAttachment(maxLength = 3, unlimited = true) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState();
  const { enqueueSnackbar } = useSnackbar();

  //states

  //useeffect
  useEffect(() => {
    uploadError && setTimeout(() => setUploadError(""), 5000);
  }, [uploadError]);

  //functions
  const getFile = useCallback(() => files, [files]);

  const deleteFile = useCallback(
    (index) => {
      const temp = [...files];
      temp.splice(index, 1);
      setFiles(temp);
    },
    [files]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.map((acceptedFile) => {
        return setFiles((files) => {
          const sameFile = files.filter(
            (file) => file.name === acceptedFile.name
          );

          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );

          if (files.length < maxLength || unlimited) {
            if (sameFile.length > 0) {
              return [...files];
            } else return [...files, acceptedFile];
          } else {
            !uploadError && setUploadError(`Maximum ${maxLength} Files`);
            return [...files];
          }
        });
      });
    },
    [maxLength, uploadError, unlimited]
  );

  const getTotalUploadedFiles = useCallback(() => files.length, [files.length]);

  const startUpload = async () => {
    setIsUploading(true);
    const allPromises = [];
    files.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      allPromises.push(axios.post("document", formData));
    });

    const resData = await Promise.allSettled(allPromises);
    resData.forEach(({ status, reason }) => {
      if (status === "fulfilled")
        enqueueSnackbar("DONE", {
          variant: "success",
        });
      else
        enqueueSnackbar(reason?.response?.data?.message, {
          variant: "error",
        });
    });
    setIsUploading(false);
    setFiles([]);
    return resData;
  };

  const { getRootProps, getInputProps, isDragActive, rejectedFiles } =
    useDropzone({
      onDrop,
      accept: "image/jpeg, image/png, image/jpg",
      maxSize: 5000000,
      multiple: true,
    });

  useEffect(() => {
    if (rejectedFiles?.length > 0)
      setUploadError("*File Must Be JPEG/JPG/PNG & Not More Than 5MB");
  }, [rejectedFiles]);

  const uploadBox = (
    <React.Fragment>
      <Grid container style={{ opacity: isUploading && 0.5 }}>
        {isUploading && (
          <Box style={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        {[...files] &&
          [...files].map((file, index) => {
            return (
              <Grid item xs={4}>
                <Box p={1}>
                  <img src={file.preview} alt={file.path} width="100%" />
                  <Box
                    display="flex"
                    alignItems="center"
                    textAlign="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="caption">{file.name}</Typography>
                    <Stack direction="row" spacing={1}>
                      {index > 0 && (
                        <IconButton
                          disabled={isUploading}
                          onClick={() => {
                            setFiles((files) => {
                              return arrayMoveImmutable(
                                files,
                                index,
                                index - 1
                              );
                            });
                          }}
                        >
                          <CustomIcon icon="keyboard_arrow_left" />
                        </IconButton>
                      )}
                      {index < files.length - 1 && (
                        <IconButton
                          disabled={isUploading}
                          onClick={() => {
                            setFiles((files) => {
                              return arrayMoveImmutable(
                                files,
                                index,
                                index + 1
                              );
                            });
                          }}
                        >
                          <CustomIcon icon="keyboard_arrow_right" />
                        </IconButton>
                      )}
                      <IconButton
                        disabled={isUploading}
                        onClick={() => deleteFile(index)}
                      >
                        <CustomIcon icon="delete" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            );
          })}
      </Grid>
      <Box
        p={1}
        textAlign="center"
        {...getRootProps()}
        borderColor={isDragActive && "#343c56"}
        color={isDragActive && "#343c56"}
      >
        <Box border="dotted" p={1}>
          <input {...getInputProps()} />
          <Typography>
            {maxLength > 1 && !unlimited
              ? `Browse file here (Max ${maxLength} files)`
              : "Browse file here"}
          </Typography>
          <Typography>{"*Only jpeg, jpg, png *File size < 5MB"}</Typography>
        </Box>
      </Box>
      {uploadError && (
        <ListItem>
          <ListItemText disableTypography={true}>
            <Typography color="error" variant="caption" component="h1">
              {uploadError}
            </Typography>
          </ListItemText>
        </ListItem>
      )}
    </React.Fragment>
  );

  const uploadAttachment = <Box>{uploadBox}</Box>;

  return {
    startUpload,
    getTotalUploadedFiles,
    uploadAttachment,
    getFile,
    setFiles,
    isUploading,
  };
}

export default useUploadAttachment;
