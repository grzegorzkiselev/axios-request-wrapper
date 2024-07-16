import { describe, expect, it, jest } from "@jest/globals";
import { AxiosHeaders, AxiosResponse } from "axios";
import { doRequestWithRetry } from "./do-request-with-retry";

const ResponseDummy: AxiosResponse = {
  data: "succeed",
  status: 200,
  statusText: "",
  headers: {},
  config: { headers: new AxiosHeaders() },
};

describe("Tecты попыток", () => {
  it("При ошибке выполняется нужное количество раз", async () => {
    const mockFuncWithError = jest.fn(
      () => Promise.reject(new Error()),
    );

    const retryCount = 5;

    await expect(
      doRequestWithRetry(
        mockFuncWithError,
        { retryCount },
      )).rejects.toThrow();

    expect(mockFuncWithError.mock.calls.length).toBe(retryCount + 1);
  });

  it("Успешно выполняется после двух ошибок", async () => {
    const mockFuncWithError = jest.fn(
      () => Promise.resolve(ResponseDummy),
    );

    mockFuncWithError
      .mockReturnValueOnce(Promise.reject(null).catch(e => e))
      .mockReturnValueOnce(Promise.reject(null).catch(e => e));

    const errorCount = 2;
    const retryCount = 5;

    await expect(
      doRequestWithRetry(
        mockFuncWithError,
        { retryCount },
      ),
    ).resolves.toBe("succeed");

    expect(mockFuncWithError.mock.calls.length).toBe(errorCount + 1);
  });

  it("Выполняется один раз, если количество попыток не задано", async () => {
    const mockFuncWithError = jest.fn(
      () => Promise.reject(new Error()),
    );

    await expect(doRequestWithRetry(
      mockFuncWithError,
    )).rejects.toThrow();

    expect(mockFuncWithError.mock.calls.length).toBe(1);
  });

  it("Выполняется один раз, если ошибки не произошло", async () => {
    const mockFuncWithoutError = jest.fn(
      () => Promise.resolve(ResponseDummy),
    );

    await expect(doRequestWithRetry(
      mockFuncWithoutError,
    )).resolves.toBeTruthy();

    expect(mockFuncWithoutError.mock.calls.length).toBe(1);
  });
});
