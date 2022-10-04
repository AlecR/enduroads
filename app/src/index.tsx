import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./components/app";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import NotFound from "./components/not-found";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import ProtectedRoute from "./components/protected-route";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute component={<Dashboard />} />,
  },
]);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
