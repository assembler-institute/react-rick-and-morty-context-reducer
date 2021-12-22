import { actionTypes } from "./reducer";
import { BASE_URL, getUrl, getPath } from "../../services/rickAndMorty";

const request = (actionType) => {
  return {
    type: actionType
  };
};

const success = (actionType, data) => {
  return {
    type: actionType,
    payload: data
  };
};

const error = (actionType, error) => {
  return {
    type: actionType,
    payload: error
  };
};

export async function getCharacters(dispatch) {
  dispatch(request(actionTypes.CHARACTERS_REQUEST));
  try {
    const { data, hasError, error } = await getPath("/character");
    if (hasError) return dispatch(error(actionTypes.CHARACTERS_ERROR, error));
    return dispatch(success(actionTypes.CHARACTERS_SUCCESS, data));
  } catch (err) {
    return dispatch(error(actionTypes.CHARACTERS_ERROR, err));
  }
}

export function getCharactersByUrl(dispatch) {
  return async function thunk(url = `${BASE_URL}/character?page=1`) {
    console.log("Requesting characters...");
    dispatch(request(actionTypes.CHARACTERS_REQUEST));
    try {
      const { data, hasError, error } = await getUrl(url);
      if (hasError) return dispatch(error(actionTypes.CHARACTERS_ERROR, error));
      const arr = url.split("=");
      data.currentPage = arr[arr.length - 1];
      return dispatch(success(actionTypes.CHARACTERS_SUCCESS, data));
    } catch (err) {
      return dispatch(error(actionTypes.CHARACTERS_ERROR, err));
    }
  };
}
