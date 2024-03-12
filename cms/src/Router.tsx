import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/login.page";
import AuthLayout from "./layouts/auth.layout";
import WebAppLayout from "./layouts/web-app.layout";
import AdminPanelPage from "./pages/web-app/admin-panel.page";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/auth/login",
        element: <AuthLayout />,
        children: [{ path: "/auth/login", element: <LoginPage /> }],
      },
      {
        path: "/web-app",
        element: <WebAppLayout />,
        children: [{ path: "/web-app/admin-panel", element: <AdminPanelPage /> }],
      },
    ],
  },
]);
