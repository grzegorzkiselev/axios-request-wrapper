import axios, { AxiosHeaders, AxiosStatic } from "axios";

class ServiceAxios {
  readonly #instance: AxiosStatic;
  readonly #defaultHeaders = new AxiosHeaders(
    { "TestHeader": "test" }
  );

  constructor(axiosInstance: AxiosStatic) {
    this.#instance = axiosInstance;
  }

  /** @type { this.#instance.get } */
  get(url, options = {}) {
    return this.#instance.get(
      url,
      {
        ...options,
        headers: {
          ...this.#defaultHeaders,
          ...options.header,
        }
      }
    );
  }
}

let serviceAxios: null | ServiceAxios = null;
export const getServiceAxios = () => {
  return (
    serviceAxios
    || (serviceAxios = new ServiceAxios(axios))
  );
};

getServiceAxios().get("https://google.com")
  .then(({ config }) => console.log(config.headers));

getServiceAxios().get("https://yandex.com")
  .then(({ config }) => console.log(config.headers));
