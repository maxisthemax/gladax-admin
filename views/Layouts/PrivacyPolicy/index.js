import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useSnackbar } from "notistack";

//*components
import { Button } from "components/Buttons";
//*material-ui

import Paper from "@mui/material/Paper";
//*utils

//*useHooks

//*utils
import axios from "utils/http-anxios";

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

function PrivacyPolicy() {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const [editorState, setEditorState] = useState();
  const { data, mutate, isValidating } = useSwrHttp(`layout/privacypolicy`, {
    fallbackData: null,
  });
  const htmlData = data?.layout.html;
  useEffect(() => {
    if (htmlData) {
      const contentBlock = htmlToDraft(htmlData);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorStateDummy = EditorState.createWithContent(contentState);
        setEditorState(editorStateDummy);
      }
    }
  }, [htmlData]);

  //*const

  //*functions
  const onSubmit = async () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    const markup = draftToHtml(rawContentState);

    try {
      const resData = data
        ? await axios.patch(`layout/privacypolicy`, {
            layout: { html: markup },
          })
        : await axios.post("layout", {
            key: "privacypolicy",
            layout: { html: markup },
          });

      if (resData)
        enqueueSnackbar("Done", {
          variant: "success",
        });
      mutate();
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Button onClick={onSubmit}>Save</Button>

      {!isValidating && (
        <Editor
          defaultEditorState={editorState}
          onBlur={(e, data) => {
            setEditorState(data);
          }}
        />
      )}
    </Paper>
  );
}

export default PrivacyPolicy;
