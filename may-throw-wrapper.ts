import axios, { AxiosPromise, AxiosResponse } from "axios";

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

interface TypedThen<T> extends AxiosResponse {
  then(): Awaited<T>;
}

const catchErrorOnPromise = <P extends Promise<AxiosResponse>>(promise: P): TypedThen<P> => {
  return promise
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      onNetworkError(error);
      return error;
    });
};

// const data = axios.get<{ title: string }[]>("");
// type aw = Awaited<typeof data>
// type dt = aw["data"]

catchErrorOnPromise(
  axios.get<{ title: string }[]>("")
)
  .then((result) => {
    try {
      result.data.map(roulette);
    } catch(error) {
      console.error("MAPPING ERROR", error instanceof Error ? error.message : error);
    }
  })
  .catch((error) => {
    console.warn("REQUEST FAILED WITH ERROR:", error);
  });
