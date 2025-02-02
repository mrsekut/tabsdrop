import { useStorage } from "@plasmohq/storage/hook";

export const usePocketConsumerKey = () => {
  const [consumerKey, setConsumerKey] = useStorage("consumerKey", "")
  return { consumerKey, setConsumerKey }
}
