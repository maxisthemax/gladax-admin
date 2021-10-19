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
    const accessToken = encryptStorage.decrypt("access_token");

    accessToken && (req.headers["Authorization"] = `Bearer ${accessToken}`);

    return req;
  },
  (err) => err
);

export default instance;
