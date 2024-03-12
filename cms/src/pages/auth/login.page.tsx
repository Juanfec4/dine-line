import LoginForm from "@/components/form/login.form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import { FC } from "react";
import { Navigate } from "react-router-dom";

const LoginPage: FC = () => {
  //Check if user is logged in (admin refresh token exists in cookies)
  if (Cookies.get("adminRefreshToken")) {
    return <Navigate to="/web-app/admin-panel" />;
  }
  return (
    <Card className=" min-w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Admin login</CardTitle>
        <CardDescription className="text-center">Dine Line CMS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export default LoginPage;
