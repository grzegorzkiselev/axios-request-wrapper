import axios, { AxiosHeaders, AxiosStatic } from "axios";

class ServiceAxios {
  private readonly instance: AxiosStatic;
  private readonly defaultHeaders = new AxiosHeaders(
    { "TestHeader": "test" }
  );

  constructor(axiosInstance: AxiosStatic) {
    this.instance = axiosInstance;
  }

  get: typeof this.instance.get = (url, options = {}) => {
    return this.instance.get(
      url,
      {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.header,
        }
      }
    );
  };
}

export const getServiceAxios = (() => {
  let serviceAxios: null | ServiceAxios = null;

  return () => {
    return (
      serviceAxios
      || (serviceAxios = new ServiceAxios(axios))
    );
  };
})();

getServiceAxios().get("https://google.com")
  .then(({ config }) => console.log(config.headers));

getServiceAxios().get("https://yandex.com")
  .then(({ config }) => console.log(config.headers));
