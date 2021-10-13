import useSWRImmutable from "swr/immutable";

const url = {
  staging: "http://47.254.248.181/",
};

function useSwrHttp(func, options = {}) {
  const swr = useSWRImmutable(`${url["staging"]}${func}`, options);
  return swr;
}

export default useSwrHttp;
