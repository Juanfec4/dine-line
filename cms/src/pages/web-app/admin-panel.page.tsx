import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Cookies from "js-cookie";
import { Sheet } from "@/components/ui/sheet";
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { IconCubePlus } from "@tabler/icons-react";

const AdminPanelPage: FC = () => {
  //Check if user is  not logged in (admin refresh token does not exist in cookies)
  if (!Cookies.get("adminRefreshToken")) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex space-x-2">
      <h1 className="text-3xl font-bold">Menu Items</h1>
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <IconCubePlus className="h-4 w-4 mr-1" />
          Add
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a new menu item</SheetTitle>
            <SheetDescription>This will allow you to add a new item to the menu.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminPanelPage;
