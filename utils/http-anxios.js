import axios from "axios";

const url = {
  staging: "http://47.254.248.181/",
};

const instance = axios.create({
  //baseURL: url[process.env.APP_ENV],
  baseURL: url["staging"],
});

export default instance;
