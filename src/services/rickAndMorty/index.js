import axios from "axios";

import { handleResponse } from "../../utils";

export const BASE_URL = "https://rickandmortyapi.com/api";

const api = axios.create({
  baseURL: BASE_URL
});

export async function getUrl(
  url = "https://rickandmortyapi.com/api/character"
) {
  try {
    const res = await axios.get(url);
    //console.log(res);
    return handleResponse({ data: res.data });
  } catch (err) {
    console.log(err);
    return handleResponse({ hasError: true, error: err });
  }
}

export async function getPath(path = "/") {
  try {
    const res = await api.get(path);
    //console.log(res);
    return handleResponse({ data: res.data });
  } catch (err) {
    console.log(err);
    return handleResponse({ hasError: true, error: err });
  }
}
