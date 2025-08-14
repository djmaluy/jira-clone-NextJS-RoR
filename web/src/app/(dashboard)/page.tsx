"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !user) {
      router.push(routes.SIGN_IN);
    }
  }, [user, isPending, router]);

  return <div>This is a home page</div>;
}
