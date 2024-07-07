import { doRequestWithRetry } from "./do-request-with-retry";
import { getServiceAxios } from "./service-axios";

export const mapResponseData = () => {
  return doRequestWithRetry(
    () => getServiceAxios().get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos"),
  ).then((data) => {
    return data.map((item) => item.title);
  });
};
