import { setupServer, SetupServerApi } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// export const getMockNode = (() => {
//   let server: null | SetupServerApi = null;

//   return () => {
//     if (server) {
//       return server;
//     }

//     server = setupServer(...handlers);
//     server.listen();
//     return server;
//   };
// })();
