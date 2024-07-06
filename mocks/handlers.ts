import { http, HttpResponse } from "msw";
import happyPathData from "./happy-path-data";

export const handlers = [
  http.get("https://jsonplaceholder.typicode.com/todos", () => {
    return HttpResponse.json(
      happyPathData,
      { status: 200 },
    );
  }),
];
