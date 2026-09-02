import { useState } from "react";
import { Outlet } from "react-router-dom";

import AgentSidebar from "./AgentSidebar";
import AgentNav from "./AgentNav";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

export const AgentLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFFDF9] text-[#14213D] antialiased">
      <FontImports />

      {/* Sidebar Component */}
      <AgentSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Sticky Header / Navigation */}
        <AgentNav
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
