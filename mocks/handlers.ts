import { http, HttpResponse } from "msw";
import { happyPathData } from "./responses-data";

export const handlers = [
  http.get("https://jsonplaceholder.typicode.com/todos", () => {
    return HttpResponse.json(
      happyPathData,
      { status: 200 },
    );
  }),
];
