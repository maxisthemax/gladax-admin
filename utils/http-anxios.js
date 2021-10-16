import axios from "axios";
import { encryptStorage } from "utils/encryptStorage";

const url = {
  staging: "http://47.254.248.181/",
};

const instance = axios.create({
  //baseURL: url[process.env.APP_ENV],
  baseURL: url["staging"],
});

instance.interceptors.request.use(
  (req) => {
    const jwt = encryptStorage.decrypt("access_token");

    jwt && (req.headers["Authorization"] = `Bearer ${jwt}`);

    return req;
  },
  (err) => err
);

export default instance;
