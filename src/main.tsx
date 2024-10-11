import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./RTK/store/store.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <div id="loaderModal"></div>
      <div id="playlistModal"></div>
      <div id="deleteModal"></div>
    </Provider>
  </StrictMode>
);
