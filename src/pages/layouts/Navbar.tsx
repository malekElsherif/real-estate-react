import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Myfav from "../properties/Myfavourites";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const Navbar = () => {
  const { data } = usegetme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openFav, setOpenFav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    queryClient.removeQueries({
      queryKey: ["me"],
    });

    setMobileMenuOpen(false);
    navigate("/login");
  };

  const user = data?.data;
  const userRole = user?.role?.toUpperCase();

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <FontImports />
      <nav className="border-b border-[#14213D] bg-[#FFFDF9] text-[#14213D] sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <div
            onClick={() => handleNavigation("/")}
            className={`${serif} cursor-pointer text-2xl font-bold tracking-tight text-[#14213D] transition-colors hover:text-[#B8863B]`}
          >
            ESTATE.
          </div>

          {/* Desktop Nav Links */}
          <div className={`${mono} hidden items-center gap-8 text-xs font-semibold uppercase tracking-wider md:flex`}>
            <button
              onClick={() => handleNavigation("/")}
              className="text-[#14213D] transition-colors hover:text-[#B8863B]"
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/properties")}
              className="text-[#4A5568] transition-colors hover:text-[#14213D]"
            >
              Properties
            </button>

            <button
              onClick={() => handleNavigation("/about")}
              className="text-[#4A5568] transition-colors hover:text-[#14213D]"
            >
              About
            </button>

            <button
              onClick={() => handleNavigation("/contact")}
              className="text-[#4A5568] transition-colors hover:text-[#14213D]"
            >
              Contact
            </button>

            {/* My Requests (متاح للمستخدم العادي USER فقط) */}
            {user && userRole === "USER" && (
              <button
                onClick={() => handleNavigation("/myrequests")}
                className="text-[#4A5568] transition-colors hover:text-[#14213D]"
              >
                My Requests
              </button>
            )}
          </div>

          {/* Desktop User Controls */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                {/* Favorites */}
                <button
                  onClick={() => setOpenFav(true)}
                  className="flex h-10 w-10 items-center justify-center border border-[#14213D] bg-[#FFFDF9] text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF]"
                  title="Favorites"
                >
                  <FavoriteBorderOutlinedIcon fontSize="small" />
                </button>

                {/* Dashboard (for AGENT role) */}
                {userRole === "AGENT" && (
                  <button
                    onClick={() => handleNavigation("/agent/dashboard")}
                    className={`${mono} border border-[#B8863B] bg-[#B8863B] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-[#14213D] hover:border-[#14213D]`}
                  >
                    Dashboard
                  </button>
                )}

                {/* Profile */}
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`${mono} border border-[#14213D] bg-[#EFEAE0] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-[#14213D] hover:text-[#FFFDF9]`}
                >
                  {user.name}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className={`${mono} border border-[#B8452E] bg-[#B8452E] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-transparent hover:text-[#B8452E]`}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className={`${mono} flex items-center gap-3 text-xs font-semibold uppercase tracking-wider`}>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="px-4 py-2 text-[#14213D] transition hover:text-[#B8863B]"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigation("/register")}
                  className="border border-[#14213D] bg-[#14213D] px-5 py-2.5 text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B]"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <button
                onClick={() => setOpenFav(true)}
                className="flex h-9 w-9 items-center justify-center border border-[#14213D] bg-[#FFFDF9] text-[#14213D]"
                title="Favorites"
              >
                <FavoriteBorderOutlinedIcon fontSize="small" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-[#14213D] text-[#14213D]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#FFFDF9] border-l border-[#14213D] p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#14213D]/10 pb-4">
            <span className={`${serif} text-xl font-bold text-[#14213D]`}>Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#14213D] p-1 hover:text-[#B8452E]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`${mono} mt-6 flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider`}>
            <button
              onClick={() => handleNavigation("/")}
              className="text-left py-2 text-[#14213D] hover:text-[#B8863B] transition"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/properties")}
              className="text-left py-2 text-[#4A5568] hover:text-[#14213D] transition"
            >
              Properties
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className="text-left py-2 text-[#4A5568] hover:text-[#14213D] transition"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-left py-2 text-[#4A5568] hover:text-[#14213D] transition"
            >
              Contact
            </button>

            {user && userRole === "USER" && (
              <button
                onClick={() => handleNavigation("/myrequests")}
                className="text-left py-2 text-[#4A5568] hover:text-[#14213D] transition"
              >
                My Requests
              </button>
            )}
          </div>
        </div>

        {/* Drawer User Actions / Footer */}
        <div className={`${mono} border-t border-[#14213D]/10 pt-4 flex flex-col gap-3 text-xs font-semibold uppercase tracking-wider`}>
          {user ? (
            <>
              {userRole === "AGENT" && (
                <button
                  onClick={() => handleNavigation("/agent/dashboard")}
                  className="w-full border border-[#B8863B] bg-[#B8863B] py-2.5 text-[#FFFDF9] text-center transition hover:bg-[#14213D]"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full border border-[#14213D] bg-[#EFEAE0] py-2.5 text-[#14213D] text-center transition hover:bg-[#14213D] hover:text-[#FFFDF9]"
              >
                {user.name}
              </button>
              <button
                onClick={handleLogout}
                className="w-full border border-[#B8452E] bg-[#B8452E] py-2.5 text-[#FFFDF9] text-center transition hover:bg-transparent hover:text-[#B8452E]"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full border border-[#14213D] py-2.5 text-[#14213D] text-center transition hover:bg-[#14213D] hover:text-[#FFFDF9]"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="w-full border border-[#14213D] bg-[#14213D] py-2.5 text-[#F7F5EF] text-center transition hover:bg-[#B8863B] hover:border-[#B8863B]"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorites Dialog */}
      {user && (
        <Myfav
          open={openFav}
          onClose={() => setOpenFav(false)}
        />
      )}
    </>
  );
};

export default Navbar;
