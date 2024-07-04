import { http, HttpResponse } from "msw";

const successJson = [
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false,
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false,
  },
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false,
  },
  {
    "userId": 1,
    "id": 4,
    "title": "et porro tempora",
    "completed": true,
  },
];

export const handlers = [
  http.get("https://api.com/ok", () => {
    return new HttpResponse(JSON.stringify(successJson), { status: 200 });
  }),
  http.get("https://api.com/notok", () => {
    return new HttpResponse("STATUS NOT OK", { status: 500 });
  }),
];
