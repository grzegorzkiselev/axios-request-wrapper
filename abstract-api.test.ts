import { describe, expect, it } from "@jest/globals";
import { http, HttpResponse } from "msw";
import { mapResponseData } from "./abstract-api";
import { server } from "./mocks/node";

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
