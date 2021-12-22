import React, { createContext, useReducer, useContext } from "react";
import * as actions from "./actions";

export const actionTypes = {
  CHARACTERS_REQUEST: "CHARACTERS_REQUEST",
  CHARACTERS_SUCCESS: "CHARACTERS_SUCCESS",
  CHARACTERS_ERROR: "CHARACTERS_ERROR",
  CURRENT_PAGE_UPDATE: "CURRENT_PAGE_UPDATE"
};

const RickAndMortyContext = createContext();

const initialState = {
  data: {
    characterIds: {},
    characters: {},
    currentPage: 1,
    hasNext: false,
    hasPrev: false
  },
  metadata: {
    totalPages: 0,
    nextUrl: null,
    prevUrl: null
  },
  isFetching: false,
  hasError: false,
  fetchError: null
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.CHARACTERS_REQUEST: {
      return {
        ...state,
        metadata: {
          ...state.metadata,
          nextUrl: null
        },
        isFetching: true,
        hasError: false,
        fetchError: null
      };
    }
    case actionTypes.CHARACTERS_SUCCESS: {
      const { next, prev, pages } = action.payload.info;
      const newIds = [];
      const newObjs = { ...state.data.characters };

      action.payload.results.forEach((c) => {
        newIds.push(c.id);
        newObjs[c.id] = c;
      });

      return {
        ...state,
        data: {
          ...state.data,
          characterIds: {
            ...state.data.characterIds,
            [action.payload.currentPage]: newIds
          },
          characters: newObjs,
          currentPage: action.payload.currentPage,
          hasPrev: prev !== null,
          hasNext: next !== null
        },
        metadata: {
          ...state.metadata,
          totalPages: pages,
          nextUrl: next,
          prevUrl: prev
        },
        isFetching: false
      };
    }
    case actionTypes.CHARACTERS_ERROR: {
      return {
        ...state,
        isFetching: false,
        hasError: true,
        fetchError: action.payload
      };
    }
    case actionTypes.CURRENT_PAGE_UPDATE: {
      return {
        ...state,
        data: {
          ...state.data,
          currentPage: action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
}

function RickAndMortyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getCharactersByUrl } = actions;

  const {
    data: { characterIds, currentPage },
    metadata: { nextUrl, prevUrl }
  } = state;

  const getNextPage = () => {
    if (characterIds[currentPage + 1]) {
      console.log("Has next");
      dispatch({
        type: actionTypes.CURRENT_PAGE_UPDATE,
        payload: currentPage + 1
      });
      return;
    }
    getCharactersByUrl(dispatch)(nextUrl);
  };

  const getPrevPage = () => {
    if (characterIds[currentPage - 1]) {
      console.log("Has prev");
      dispatch({
        type: actionTypes.CURRENT_PAGE_UPDATE,
        payload: currentPage - 1
      });
      return;
    }
    getCharactersByUrl(dispatch)(prevUrl);
  };

  const value = {
    state,
    getNextPage,
    getPrevPage,
    getCurrent: () => getCharactersByUrl(dispatch)()
    /* getCharacters: () => getCharacters(dispatch),
    getCharactersByUrl: (url) => getCharactersByUrl(dispatch)(url) */
  };

  return (
    <RickAndMortyContext.Provider value={value}>
      {children}
    </RickAndMortyContext.Provider>
  );
}

function useRickAndMorty() {
  const context = useContext(RickAndMortyContext);
  if (!context) return null;
  return context;
}

export { RickAndMortyProvider, useRickAndMorty };
