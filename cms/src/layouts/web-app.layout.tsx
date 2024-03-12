import { FC } from "react";
import { Outlet } from "react-router-dom";

const WebAppLayout: FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto">
      <Outlet />
    </div>
  );
};

export default WebAppLayout;
