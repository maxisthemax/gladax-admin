import { useRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "theme";
import createEmotionCache from "utils/createEmotionCache";
import { store } from "app/store";
import { Provider } from "reactive-react-redux";
import { SnackbarProvider } from "notistack";

import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { CustomIcon } from "components/Icons";
import LayoutWrapper from "layouts/LayoutWrapper";
import { SWRConfig } from "swr";
import axios from "axios";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const notistackRef = useRef();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig
          value={{
            fetcher: async (resource) => {
              const fetch = await axios.get(resource);
              const data = JSON.parse(
                fetch.request.response,
                function (key, value) {
                  if (typeof value === "string") {
                    if (isIsoDate(value)) {
                      return new Date(value);
                    }
                  }
                  return value;
                }
              );
              return data;
            },
            errorRetryCount: 5,
            revalidateOnFocus: false,
          }}
        >
          <Provider store={store}>
            <SnackbarProvider
              maxSnack={3}
              ref={notistackRef}
              action={(key) => (
                <IconButton onClick={onClickDismiss(key)}>
                  <CustomIcon icon="close" color="white" />
                </IconButton>
              )}
            >
              <LayoutWrapper>
                <Container maxWidth="xl" disableGutters>
                  <Component {...pageProps} />
                </Container>
              </LayoutWrapper>
            </SnackbarProvider>
          </Provider>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
}
