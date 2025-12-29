"use client"; // This directive marks the file as a Client Component

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar"; // Adjust import path as needed

export function NavbarWrapper() {
  const pathname = usePathname();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/auth/login", "/auth/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  // Only render Navbar if it shouldn't be hidden
  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}