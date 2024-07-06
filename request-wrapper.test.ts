import { expect, it, jest } from "@jest/globals";
import { doRequestWithRetry } from "./request-wrapper";
import { getServiceAxios } from "./service-axios";
import { mockNode } from "./mocks/node";

mockNode();

it("Успешный запрос возвращает заданный ответ",  async () => {
  await expect(
    doRequestWithRetry(() => getServiceAxios().get("https://api.com/ok")),
  ).resolves.toHaveLength(4);
});

it("Сломанная апи возвращает реджект", async () => {
  await expect(
    doRequestWithRetry(() => getServiceAxios().get("https://api.com/notok")),
  ).rejects.toThrowError("BAD");
});

it("При ошибке выполняется нужное количество раз", async () => {
  const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://api.com/notok"));
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
  const mockFuncWithError = jest.fn(() => getServiceAxios().get("https://api.com/notok"));

  try {
    await doRequestWithRetry(
      mockFuncWithError,
    );
  } catch(_) {
    expect(mockFuncWithError.mock.calls.length).toBe(1);
  }
});

it("Выполняется один раз, если ошибки не произошло", async () => {
  const mockFuncWithoutError = jest.fn(() => getServiceAxios().get("https://api.com/ok"));

  try {
    await doRequestWithRetry(
      mockFuncWithoutError,
    );
  } catch(_) {
    expect(mockFuncWithoutError.mock.calls.length).toBe(1);
  }
});
