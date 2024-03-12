import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import requestClient from "@/api/auth.interceptor";
import { LoginMutationPayload } from "@/types/payload/login-mutation.payload";
import { AxiosError, AxiosResponse } from "axios";
import { LoginResponse } from "@/types/response/login.response";
import Cookies from "js-cookie";
import { IN_ONE_HOUR, IN_SEVEN_DAYS } from "@/helpers/contants";
import { ApiExceptionResponse } from "@/types/exception-response/api.exception-response";
import FormError from "../custom/form-error";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username must not be empty." }),
  password: z.string().min(1, { message: "Password must not be empty." }),
});

const LoginForm: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginMutationPayload) =>
      requestClient({ method: "POST", isPublic: true, url: "/iam/admin/login", data }),
    onSuccess: ({ data }: AxiosResponse<LoginResponse>) => {
      Cookies.set("adminAccessToken", data.adminAccessToken, {
        expires: IN_ONE_HOUR,
        sameSite: "strict",
      });

      Cookies.set("adminRefreshToken", data.adminRefreshToken, {
        expires: IN_SEVEN_DAYS,
        sameSite: "strict",
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as ApiExceptionResponse;

      console.log(error);

      if (Array.isArray(message)) {
        message.forEach((error) => {
          if (error.startsWith("username")) {
            form.setError("username", { type: "validate", message: error });
          }
          if (error.startsWith("password")) {
            form.setError("password", { type: "validate", message: error });
          }
        });
      } else {
        form.setError("root.serverError", { type: "401", message });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
  };
  const rootError = (form.formState.errors as any).root?.serverError;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-sm">Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-sm">Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {rootError?.type === "401" && <FormError message={rootError.message} />}
        <Button className="w-full bg-green-600 hover:bg-green-500" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
