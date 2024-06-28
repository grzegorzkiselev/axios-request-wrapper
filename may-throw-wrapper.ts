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
  (promise: P): Promise<Awaited<P>["data"]> | Promise<AxiosError> => {
  return promise
    .then(({ data }) => data)
    .catch((error) => {
      onNetworkError(error); return error;
    });
};

// https://jsonplaceholder.typicode.com/todos
getDataFromRequest(
  axios.get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
)
  .then((result) => {
    if (result instanceof AxiosError) {
      throw result;
    }

    try {
      result.map(roulette);
    } catch(error) {
      console.error("MAPPING ERROR", error instanceof Error ? error.message : error);
    }
  })
  .catch((error) => {
    console.warn("REQUEST FAILED WITH ERROR:", error.message);
  });
