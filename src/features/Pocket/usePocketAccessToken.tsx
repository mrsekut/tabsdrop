import { useStorage } from "@plasmohq/storage/hook";

export const usePocketAccessToken = () => {
  const [accessToken, setAccessToken] = useStorage("accessToken", "");
  return { accessToken, setAccessToken };
};
