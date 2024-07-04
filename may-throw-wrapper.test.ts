import { expect, it, jest } from "@jest/globals";
import { doRequest } from "./may-throw-wrapper";
import { getServiceAxios } from "./axios-decorate";

it("При ошибке выполняется нужное количество раз", async () => {
  const mockFuncWithError = jest.fn(() => getServiceAxios().get(""));
  const retryCount = 5;

  try {
    await doRequest(
      mockFuncWithError,
      { retryCount },
    );
  } catch(_) {
    expect(mockFuncWithError.mock.calls.length).toBe(retryCount + 1);
  }
});

it("Выполняется один раз, если количество попыток не задано", async () => {
  const mockFuncWithError = jest.fn(() => getServiceAxios().get(""));

  try {
    await doRequest(
      mockFuncWithError,
    );
  } catch(_) {
    expect(mockFuncWithError.mock.calls.length).toBe(1);
  }
});

it("Выполняется один раз, если ошибки не произошло", async () => {
  const mockFuncWithoutError = jest.fn(() => getServiceAxios().get("https://google.com"));

  try {
    await doRequest(
      mockFuncWithoutError,
    );
  } catch(_) {
    expect(mockFuncWithoutError.mock.calls.length).toBe(1);
  }
});
