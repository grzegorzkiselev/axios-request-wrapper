import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const mockNode = () => {
  const server = setupServer(...handlers);
  server.listen();
};
