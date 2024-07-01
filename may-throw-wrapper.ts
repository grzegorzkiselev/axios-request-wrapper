import axios, { AxiosError, AxiosResponse } from "axios";

const roulette = (item: { title: string }) => {
  const youReDead = Math.floor(Math.random() * 6) === 0;

  if (youReDead) {
    throw new Error("Bad luck on the item with title " + item.title + " :—(");
  }

  return item.title;
};

const onNetworkError = (error: Error) => {
  console.error("NETWORK ERROR", error instanceof Error ? error.message : error);
};

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const doRequest =
<T extends () => Promise<AxiosResponse<Awaited<ReturnType<T>>["data"]>>>
  (requester: T, { retryCount = 0 }: { retryCount: number })
: Promise<Awaited<ReturnType<T>>["data"]> => {
  const maxRetryDelay = 1000;
  const minRetryDelay = 200;

  const tryRequest = (): Promise<Awaited<ReturnType<T>>["data"]> => {
    return requester()
      .then(({ data }) => data)
      .catch((error) => {
        if (retryCount-- > 0) {
          const retryDelay = Math.random() * (maxRetryDelay - minRetryDelay) + minRetryDelay;
          console.table({
            "Retry Number": { "Value": retryCount },
            "Retry Delay": { "Value": retryDelay },
          });
          return pause(retryDelay).then(tryRequest);
        } else {
          onNetworkError(error);
          if (error instanceof AxiosError) {
            throw new Error(error.code);
          } else {
            throw error;
          }
        }
      });
  };

  return tryRequest();
};

doRequest(
  () => axios.get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos"),
  { retryCount: 5 },
)
.then((result) => {
  try {
    return result.map(roulette);
  } catch(error) {
    console.error("MAPPING ERROR", error instanceof Error ? error.message : error);
    throw error;
  }
})
.catch((error) => {
  console.error("REQUEST FAILED WITH ERROR", error.message);
});
