import useSwr from "swr";

const url = {
  staging: process.env.NEXT_PUBLIC_API_URL,
};

function useSwrHttp(func, options = {}) {
  const swr = useSwr(func ? `${url["staging"]}${func}` : null, options);
  return { ...swr };
}

export default useSwrHttp;
