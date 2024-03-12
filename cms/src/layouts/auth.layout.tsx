import { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
  return (
    <div className="flex items-center h-screen bg-neutral-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
