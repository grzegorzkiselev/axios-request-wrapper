import { describe, expect, it, jest } from "@jest/globals";
import { doRequestWithRetry } from "./request-wrapper";
import { getServiceAxios } from "./service-axios";
import { server } from "./mocks/node";
import { http, HttpResponse } from "msw";

describe("Тесты апи", () => {
  it("Получаем реджект", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(
      doRequestWithRetry(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos")),
    ).rejects.toThrowError("BAD");
  });

  it("Получаем респонз",  async () => {
    await expect(
      doRequestWithRetry(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos")),
    ).resolves.toHaveLength(4);
  });
});

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

    try {
      await doRequestWithRetry(
        mockFuncWithError,
        { retryCount },
      );
    } catch(_) {
      expect(mockFuncWithError.mock.calls.length).toBe(retryCount + 1);
    }
  });

  it("Выполняется один раз, если количество попыток не задано", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      },
      ),
    );

    const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));

    try {
      await doRequestWithRetry(
        mockFuncWithError,
      );
    } catch(_) {
      expect(mockFuncWithError.mock.calls.length).toBe(1);
    }
  });

  it("Выполняется один раз, если ошибки не произошло", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/todos", () => {
        return new HttpResponse(null, { status: 500 });
      },
      ),
    );

    const mockFuncWithoutError = jest.fn(() => getServiceAxios().get("https://jsonplaceholder.typicode.com/todos"));

    try {
      await doRequestWithRetry(
        mockFuncWithoutError,
      );
    } catch(_) {
      expect(mockFuncWithoutError.mock.calls.length).toBe(1);
    }
  });
});
