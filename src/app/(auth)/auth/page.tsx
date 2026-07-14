"use client";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/logo";
import { IconBrandGoogle } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
export default function AuthPage() {
  const handelGoogleAuth = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/posts",
      errorCallbackURL: "/error",
    });
    if (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
    if (data) {
      toast.success("Redirecting to Google...");
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card>
        <CardHeader>
          <Logo />
          <CardTitle>Sign in or Sign up</CardTitle>
          <CardDescription>Creat account or log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handelGoogleAuth}>
            <IconBrandGoogle />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter>
          By continuing you agree with our{" "}
          <Link href="/legal">Privacy policy</Link> and
          <Link href="/legal">Terms of conditions</Link>.
        </CardFooter>
      </Card>
    </div>
  );
}
