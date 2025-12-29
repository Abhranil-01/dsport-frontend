"use client"; // This directive marks the file as a Client Component

import { usePathname } from "next/navigation";
import  Footer  from "./Footer"; // Adjust import path as needed

export function FooterWrapper() {
  const pathname = usePathname();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/auth/login", "/auth/register","/cart"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  // Only render Navbar if it shouldn't be hidden
  if (shouldHideNavbar) {
    return null;
  }

  return <Footer />;
}