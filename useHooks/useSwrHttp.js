import useSwr from "swr";

const url = {
  staging: "http://47.254.248.181/",
};

function useSwrHttp(func, options = {}) {
  const swr = useSwr(`${url["staging"]}${func}`, options);
  return swr;
}

export default useSwrHttp;
