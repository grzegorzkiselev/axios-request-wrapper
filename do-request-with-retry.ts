import { AxiosError, AxiosResponse } from "axios";

const onNetworkError = (error: Error) => {
  console.error("NETWORK ERROR", error instanceof Error ? error.message : error);
};

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const doRequestWithRetry =
<T extends () => Promise<AxiosResponse<Awaited<ReturnType<T>>["data"]>>>
(requester: T, { retryCount = 0 } = {})
: Promise<Awaited<ReturnType<T>>["data"]> => {
  const maxRetryDelay = 1000;
  const minRetryDelay = 200;

  const tryRequest = (): Promise<Awaited<ReturnType<T>>["data"]> => {
    return requester()
      .then(({ data }) => {
        return data;
      })
      .catch((error) => {
        if (retryCount-- > 0) {
          const retryDelay = Math.random() * (maxRetryDelay - minRetryDelay) + minRetryDelay;
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
