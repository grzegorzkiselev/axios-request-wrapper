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

const retryRequest = <T>(timeout, retryCount, retryDelay, retryDelayIncrement, requester: T): Promise<Awaited<ReturnType<T>>> => {
  return new Promise((resolve, reject) => {
    const step = () => {
      const time = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("timeout exeeded"));
        }, timeout);
      });

      Promise.race([
        requester(),
        time
      ])
      .then(resolve)
      .catch((error) => {
        if (retryCount--) {
          console.table({
            "rc": { "value": retryCount },
            "rd": { "value": retryDelay }
          });
          retryDelay += retryDelayIncrement;
          setTimeout(step, retryDelay);
        } else {
          reject(error);
        }
      });
    };

    step();
  });
};

// https://jsonplaceholder.typicode.com/todos
retryRequest(2000, 5, 500, 1000, () => {
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
