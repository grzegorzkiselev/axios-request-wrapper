import { describe, it, expect } from "@jest/globals";
import { server } from "./mocks/node";
import { http, HttpResponse } from "msw";
import { mapResponseData } from "./abstract-api";

describe("Тесты апи", () => {
  it("Ловит реджект", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(
      mapResponseData(),
    ).rejects.toThrow();
  });

  it("Работает с апи", async () => {
    await expect(
      mapResponseData(),
    ).resolves.not.toContain(undefined);
  });
});
