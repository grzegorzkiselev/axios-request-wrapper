// const { doRequest } = require("./may-throw-wrapper");
// const { getServiceAxios } = require("./axios-decorate");

import { expect, it, vi } from "vitest";
import { doRequest } from "./may-throw-wrapper";
import { getServiceAxios } from "./axios-decorate";

it("Работает", () => {
  const retryCount = 11;
  const mockFunc = vi.fn(() => getServiceAxios().get("https://google.com"))
  // const mockCallback = jest.fn(x => 42 + x);
  // expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

  doRequest(
    mockFunc,
    { retryCount }
  ).then(() => {
    expect(mockFunc.mock.call.length).toBe(retryCount)
  })
})
