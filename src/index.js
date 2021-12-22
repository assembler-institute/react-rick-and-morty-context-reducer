import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { RickAndMortyProvider } from "./context/RickAndMorty";

import "bootstrap/dist/css/bootstrap.min.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <RickAndMortyProvider>
      <App />
    </RickAndMortyProvider>
  </StrictMode>,
  rootElement
);
