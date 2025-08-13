"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const { logout } = useAuth();

  const user = data?.user;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(routes.SIGN_IN);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <h1>Welcome, {user.name}!</h1>
      <p>Only for authorized users</p>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
