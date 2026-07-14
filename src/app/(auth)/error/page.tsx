import type { Metadata } from "next";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 flex flex-col  items-center  justify-center">
        <div className="rounded-full bg-primary p-2 mx-auto text-primary">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl text-center font-semibold tracking-tight">
          Oops! Something went wrong
        </h1>

        <p className="text-center text-base text-muted-foreground">
          Authentication error occurred
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex w-max gap-3">
            <Link
              href="/auth"
              className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Authentication Error | SmithShop",
  description:
    "Oops! Something went wrong during sign‑in. Please try again or contact support.",
};
