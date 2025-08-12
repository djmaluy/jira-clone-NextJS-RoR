"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

type TAuthLayoutProps = {
  children: React.ReactNode;
};

function AuthLayout({ children }: TAuthLayoutProps) {
  const pathname = usePathname();
  const isSignIn = pathname === routes.SIGN_IN;

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image
            style={{ height: "60px", width: "150px" }}
            src="/logo.svg"
            height={60}
            width={150}
            priority
            alt="Logo"
          />
          <Button asChild variant="secondary">
            <Link href={isSignIn ? routes.SIGN_UP : routes.SIGN_IN}>
              {pathname === "/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
        {}
      </div>
    </main>
  );
}

export default AuthLayout;
