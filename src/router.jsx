import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Stuff from "./pages/Stuff";
import Stuff from "./pages/Stuff";
import StuffTrash from "./pages/StuffTrash";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/stuffs", element: <Stuff /> },
  { path: "/Inbound-stuff", element: <Stuff /> },
  { path: "/stuffs/trash", element: <StuffTrash /> },
]);
