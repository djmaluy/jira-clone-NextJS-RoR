"use client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-4 justify-center items-center">
      <AlertTriangle className="size-8" />
      <p className="text-sm ">Something went wrong</p>
      <Button variant="secondary" size="sm">
        <Link href={routes.HOME}>Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
