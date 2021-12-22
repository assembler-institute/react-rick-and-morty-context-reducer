import React, { useEffect } from "react";
import "./styles.css";

import { Alert, Button } from "react-bootstrap";

import { useRickAndMorty } from "./context/RickAndMorty";

export default function App() {
  const { state, getCurrent, getNextPage, getPrevPage } = useRickAndMorty();
  const {
    data: { characterIds, characters, currentPage, hasNext, hasPrev },
    metadata: { totalPages },
    isFetching,
    hasError,
    fetchError
  } = state;

  let characterItems = [];

  if (
    characterIds &&
    characterIds[currentPage] &&
    characterIds[currentPage].length > 0
  ) {
    characterItems = characterIds[currentPage].map((id) => {
      const c = characters[id];
      return (
        <li key={c.id} className="card m-2 p-2">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <h4 className="">{c.name}</h4>
            </div>
            <div className="d-flex flex-row">
              <h5 className="badge bg-secondary">{c.species}</h5>
              <h5 className="badge bg-info ms-2">{c.status}</h5>
            </div>
          </div>
        </li>
      );
    });
  }

  useEffect(() => {
    getCurrent();
  }, []);

  return (
    <div className="App container">
      <h1>Rick & Morty</h1>
      <h2>Using context and reducer</h2>
      <div className="mt-4 d-flex flex-row justify-content-center">
        <Button variant="success" disabled className="me-2">
          Current: <span>{currentPage}</span>
        </Button>
        <Button variant="dark" disabled className="me-2">
          Total: <span>{totalPages}</span>
        </Button>
      </div>
      <div className="mt-1 d-flex flex-row justify-content-center">
        {hasPrev && (
          <Button variant="primary" className="me-2" onClick={getPrevPage}>
            Prev
          </Button>
        )}
        {hasNext && (
          <Button variant="primary" onClick={getNextPage}>
            Next
          </Button>
        )}
      </div>
      <div className="container">
        {isFetching && <Alert variant="info">Fetching data...</Alert>}
        {hasError && <Alert variant="danger">{fetchError}</Alert>}
      </div>
      <div className="mt-4">
        <ul className="d-flex flex-wrap ">{characterItems}</ul>
      </div>
    </div>
  );
}
