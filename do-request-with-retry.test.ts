import { describe, expect, it, jest } from "@jest/globals";
import { doRequestWithRetry } from "./do-request-with-retry";
import { getServiceAxios } from "./service-axios";
import { server } from "./mocks/node";
import { http, HttpResponse } from "msw";

describe("Tecты попыток", () => {
  it("При ошибке выполняется нужное количество раз", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      },
      ),
    );

    const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));
    const retryCount = 5;

    await expect(
      doRequestWithRetry(
        mockFuncWithError,
        { retryCount },
      )).rejects.toThrow();

    expect(mockFuncWithError.mock.calls.length).toBe(retryCount + 1);
  });

  it("Успешно выполняется после ошибок", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      },
      { once: true },
      ),
    );

    const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));
    const retryCount = 5;

    await expect(
      doRequestWithRetry(
        mockFuncWithError,
        { retryCount },
      )).resolves.toHaveLength(4);

    expect(mockFuncWithError.mock.calls.length).toBe(1 + 1);
  });

  it("Выполняется один раз, если количество попыток не задано", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));

    await expect(doRequestWithRetry(
      mockFuncWithError,
    )).rejects.toThrow();

    expect(mockFuncWithError.mock.calls.length).toBe(1);
  });

  it("Выполняется один раз, если ошибки не произошло", async () => {
    const mockFuncWithoutError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));

    await expect(doRequestWithRetry(
      mockFuncWithoutError,
    )).resolves.toBeTruthy();

    expect(mockFuncWithoutError.mock.calls.length).toBe(1);
  });
});
