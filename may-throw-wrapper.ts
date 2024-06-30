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

const pause = (time) => new Promise((resolve) => setTimeout(resolve, time));

const doRequest =
  <T extends () => Promise<AxiosResponse<Awaited<ReturnType<T>>["data"]>>>
(requester: T, retryCount = 0)
  : Promise<Awaited<ReturnType<T>>["data"]> => {
  const max = 1000;
  const min = 200;

  const tryRequest: T = () => {
    return requester()
    .then(({ data }) => data)
    .catch((error) => {
      if (retryCount--) {
        const retryDelay = Math.random() * (max - min) + min;
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
  () => {
    return axios.get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos");
  },
  5,
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


  // const executeForceTimeout = (timeout: number) => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       reject(new Error("Timeout Exeeded"));
  //     }, timeout);

  //     setTimeout(() => {
  //       resolve(0);
  //     });
  //   });
  // };
  // return executeForceTimeout(1000)
  //   .then(() => {});


  // const getDataFromRequest = <P extends Promise<AxiosResponse>>
  //   (promise: P): Promise<Awaited<P>["data"]> | never => {
  //   return promise
  //     .then(({ data }) => data)
  //     .catch((error) => {
  //       onNetworkError(error);
  //       throw error;
  //     });
  // };

  // const retryRequest = <T extends (...args: any[]) => Promise<any>>(timeout: number, retryCount: number, retryDelay: number, retryDelayIncrement: number, requester: T): Promise<Awaited<ReturnType<T>>> => {
  //   return new Promise((resolve, reject) => {
  //     const tryRequest = () => {
  //       const timeoutPromise = new Promise((_, reject) => {
  //         setTimeout(() => {
  //           reject(new Error("Timeout Exeeded"));
  //         }, timeout);
  //       });

  //       Promise.race([
  //         requester(),
  //         timeoutPromise
  //       ])
  //         .then(resolve)
  //         .catch((error) => {
  //           if (retryCount--) {
  //             console.table({
  //               "rc": { "value": retryCount },
  //               "rd": { "value": retryDelay }
  //             });
  //             retryDelay += retryDelayIncrement;
  //             setTimeout(tryRequest, retryDelay);
  //           } else {
  //             reject(error);
  //           }
  //         });
  //     };

  //     tryRequest();
  //   });
  // };

  // // https://jsonplaceholder.typicode.com/todos
  // retryRequest(2, 5, 500, 1000, () => {
  //   return getDataFromRequest(
  //     axios.get<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
  //   );
  // })
  //   .then((result) => {
  //     try {
  //       return result.map(roulette);
  //     } catch(error) {
  //       console.error("MAPPING ERROR", error instanceof Error ? error.message : error);
  //       throw error;
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("REQUEST FAILED WITH ERROR", error.message);
  //   });

  // type TDoRequest = (
  //   <T extends (...args: any[]) => Promise<any>>(
  //     options: {
  //       requestDelay: number,
  //     },
  //     requester: (...args: any[]) => Promise<any>
  //   ) => Promise<Awaited<ReturnType<T>>>
  // )

  // doRequest(
  //   {
  //     retryCount,
  //     retryDelay,
  //   },
  //   () => {
  //     axios.get("");
  //   }
  // );
