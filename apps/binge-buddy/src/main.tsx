import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { Home, SeriesDetails } from "./app/pages";
import { theme } from "./app/theme";
import { StoreProvider} from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/series/:id",
    element: <SeriesDetails/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <RouterProvider router={router}/>
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);
