import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF9] text-[#14213D] antialiased">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Architectural Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
