import axios from "axios";
import { getTokenEmpoloyee } from "~/helper/useCookies";
const httpRequest = axios.create({
  baseURL: "http://localhost:8080/api",
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = getTokenEmpoloyee();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = async (api, option = {}) => {
  const response = await httpRequest.get(api, option);
  return response.data;
};

export const remove = async (api) => {
  const response = await httpRequest.delete(api);
  return response;
};

export const post = async (api, data, config) => {
  const response = await httpRequest.post(api, data, config);
  return response;
};

export const put = async (api, data = {}) => {
  const response = await httpRequest.put(api, data);
  return response;
};

export default httpRequest;
