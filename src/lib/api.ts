import axios from "axios";

const { ENVIRONMENT, PROD_API_URL, DEV_API_URL } = import.meta.env;

const baseURL = ENVIRONMENT === "dev" ? DEV_API_URL : PROD_API_URL;

const api = axios.create({
  baseURL,
});

export default api;
