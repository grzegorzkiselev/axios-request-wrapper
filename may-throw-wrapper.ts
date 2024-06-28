import axios, { AxiosPromise, AxiosResponse, AxiosError } from "axios";

const onNetworkError = (error) => {
  console.error("NETWORK ERROR", error instanceof Error ? error.message : error);
};

const roulette = (item) => {
  const youReDead = Math.floor(Math.random() * 6) === 0;

  if (youReDead) {
    throw new Error("Bad luck on item with title " + item.title + " :—(");
  }

  return item.title;
};

const getDataFromRequest = <P extends Promise<AxiosResponse>>
(promise: P): Promise<Awaited<P>["data"]> | never => {
  return promise
  .then(({ data }) => data)
  .catch((error) => {
    onNetworkError(error);
    throw error;
  });
};

const retryRequest = <T extends (...args: any[]) => Promise<any>>(timeout: number, retryCount: number, retryDelay: number, retryDelayIncrement: number, requester: T): Promise<Awaited<ReturnType<T>>> => {
  return new Promise((resolve, reject) => {
    const tryRequest = () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Timeout Exeeded"));
        }, timeout);
      });

      Promise.race([
        requester(),
        timeoutPromise
      ])
      .then(resolve)
      .catch((error) => {
        if (retryCount--) {
          console.table({
            "rc": { "value": retryCount },
            "rd": { "value": retryDelay }
          });
          retryDelay += retryDelayIncrement;
          setTimeout(tryRequest, retryDelay);
        } else {
          reject(error);
        }
      });
    };

    tryRequest();
  });
};

// https://jsonplaceholder.typicode.com/todos
retryRequest(2, 5, 500, 1000, () => {
  return getDataFromRequest(
    axios.get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
  );
})
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
