"use client";

import { useEffect, useState } from "react";
import { Nav } from "./ui/nav";
import { ShoppingCart, LayoutDashboard, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  useEffect(() => {
    setHasMounted(true); // Component has mounted
  }, []);

  // Adjust the sidebar width dynamically based on isCollapsed state
  const sidebarWidth = isCollapsed ? "w-16" : "w-64 md:w-80"; // w-16 could be adjusted to match the toggle button width or your preferred collapsed state width

  return (
    <div className={`relative border-r-2 border-gray-200 px-2 py-10 transition-width duration-300 ${sidebarWidth}`}>
      {hasMounted && (
        <div className={`absolute -right-12 top-6 ${mobileWidth ? "hidden" : ""}`}>
          <Button onClick={toggleSidebar} variant="secondary" className="rounded-full p-2 bg-blue-500 hover:bg-blue-600 text-white">
            {isCollapsed ? <ChevronRight className="text-lg" /> : <ChevronLeft className="text-lg" />}
          </Button>
        </div>
      )}

      {!isCollapsed && ( // Only render the Nav component when not collapsed
        <Nav
          className="space-y-16"
          // @ts-ignore
          links={[
            {
              title: "Dashboard",
              href: "/dashboard",
              icon: LayoutDashboard,
              variant: "default"
            },
            {
              title: "Deploy Contracts",
              href: "/deploy",
              icon: ShoppingCart,
              variant: "ghost"
            },
            {
              title: "Asset Management",
              href: "/assetmanager",
              icon: Settings,
              variant: "ghost"
            },
            {
              title: "AAVEV3 Management",
              href: "/aave",
              icon: Settings,
              variant: "ghost"
            },
          ].map(link => ({
            ...link,
            className: "flex items-center p-8 hover:bg-gray-100 rounded-md"
          }))}
        />
      )}
    </div>
  );
}
