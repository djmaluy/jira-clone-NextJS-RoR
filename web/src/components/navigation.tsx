"use client";

import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My tasks",
    href: routes.TASKS,
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: routes.SETTINGS,
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: routes.MEMBERS,
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {navItems.map((item) => {
        const fullHref = `${routes.WORKSPACES}/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              <p>{item.label}</p>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
