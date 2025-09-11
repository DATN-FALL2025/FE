"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { routes } from "@/constants";
import { Route } from "@/constants/sidebar-link";
import { useRole } from "@/hooks/use-auth-session-client";

export const Navigation = () => {
  const pathname = usePathname();
  const { userRole, hasRole, hasAnyRole } = useRole();

  const isRouteVisible = (route: Route) => {
    if (route.allowsRoles && !hasAnyRole(route.allowsRoles)) {
      return false;
    }
    return true;
  };

  return (
    <ul className="flex flex-col space-y-1">
      {routes.filter(isRouteVisible).map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <li key={item.label} className="mb-1">
            {item.href ? (
              <Link href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md font-semibold transition-all duration-200 hover:bg-[#FF9E40] hover:text-white hover:shadow",
                    isActive
                      ? "bg-[#FF5722] text-white shadow"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-[#FF9E40] dark:hover:bg-[#D97706]"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-base">{item.label}</span>
                </div>
              </Link>
            ) : (
              <Accordion type="single" collapsible>
                <AccordionItem value={item.label}>
                  <AccordionTrigger
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md font-semibold transition-all duration-200 hover:bg-[#FF9E40] hover:no-underline hover:text-white hover:shadow",
                      isActive
                        ? "bg-[#FF5722] text-white shadow"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-[#FF9E40] dark:hover:bg-[#D97706]"
                    )}
                  >
                    <div className="flex items-center gap-3 ">
                      <Icon className="w-6 h-6" />
                      <span className="text-base">{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-6 border-l-2 border-gray-200 pl-4 space-y-2 dark:border-gray-600">
                      {item.children?.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href!}>
                            <div className="flex items-center gap-2.5 p-2 rounded-md font-medium hover:bg-[#FF9E40] transition-all text-neutral-600 dark:text-neutral-400 hover:text-white">
                              <child.icon className="w-5 h-5" />
                              <span className="text-sm">{child.label}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </li>
        );
      })}
    </ul>
  );
};
