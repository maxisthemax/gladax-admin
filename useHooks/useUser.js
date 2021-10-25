import axios from "utils/http-anxios";
import { useRouter } from "next/router";
import { encryptStorage } from "utils/encryptStorage";
import useSwrHttp from "useHooks/useSwrHttp";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

function useUser() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = encryptStorage.decrypt("access_token");

  const { data, mutate, isValidating, error } = useSwrHttp(
    accessToken ? "account" : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {}, [error]);

  async function handleLogin(username, password) {
    try {
      const resData = await axios.post("auth/login", {
        username: username,
        password: password,
      });
      if (resData.data.role !== "A") {
        enqueueSnackbar("Administrator Only", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Login Success", {
        variant: "success",
      });

      encryptStorage.encrypt("access_token", resData.data.accessToken);
      mutate();
    } catch (eror) {
      enqueueSnackbar(eror?.response?.statusText, {
        variant: "error",
      });
    }
  }

  function handleLogout() {
    encryptStorage.remove("access_token");
    mutate({}, true);
    router.replace("/");
  }

  return {
    userData: data,
    error,
    isValidating,
    handleLogin,
    handleLogout,
    mutate,
  };
}

export default useUser;
