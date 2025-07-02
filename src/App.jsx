import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Link from "./pages/Link";
import RedirectLink from "./pages/RedirectLink";

{
  /* this createBrowserRouter function is used to create a router instance for a React application using React Router v6. It allows you to define routes and their corresponding components, enabling navigation within the application. The routes can be nested, and the router will render the appropriate component based on the current URL path. */
  /*it will take an array of objects, each object represents a route*/
}
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    /* now inside children lets decide how many routes/pages we want to create */
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/link/:id",
        element: <Link />,
      },
      {
        path: "/redirect",
        element: <RedirectLink />,
      },
    ],
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
