import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { usegetme } from "../../hooks/useUsers";
import {
  User as UserIcon,
  ClipboardList,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  MessageSquare, // تم استيراد أيقونة الشات
} from "lucide-react";
import UserRequestHistory from "../properties/UserRequestHistory";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const User = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = usegetme();

  const [activeTab, setActiveTab] = useState("profile");

  const user = data?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    queryClient.removeQueries({
      queryKey: ["me"],
    });

    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: UserIcon,
    },
    {
      id: "requests",
      label: "Request History",
      icon: ClipboardList,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
    },
    {
      id: "chats",
      label: "My Chats",
      icon: MessageSquare,
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <FontImports />
      <div className="min-h-screen bg-[#FFFDF9] text-[#14213D]">

        {/* Header */}
        <div className="border-b border-[#14213D]/10 bg-[#FFFDF9]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className={`${serif} text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl`}>
              My Account
            </h1>
            <p className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}>
              Manage your personal information and activity
            </p>
          </div>
        </div>

        {/* Main */}
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-4">

            {/* ================= SIDEBAR ================= */}
            <aside className="h-fit rounded-none border border-[#14213D]/20 bg-[#FFFDF9] p-3 shadow-none">

              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${mono} group flex w-full items-center gap-3 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider transition ${
                      active
                        ? "bg-[#14213D] text-[#FFFDF9]"
                        : "text-[#4A5568] hover:bg-[#EFEAE0] hover:text-[#14213D]"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={
                        active
                          ? "text-[#B8863B]"
                          : "text-[#4A5568] group-hover:text-[#14213D]"
                      }
                    />

                    <span className="flex-1">
                      {item.label}
                    </span>

                    <ChevronRight
                      size={15}
                      className={`transition ${
                        active
                          ? "translate-x-0 text-[#B8863B]"
                          : "text-[#4A5568] group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                );
              })}

              {/* Divider */}
              <div className="my-3 border-t border-[#14213D]/10" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`${mono} group flex w-full items-center gap-3 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#B8452E] transition hover:bg-[#B8452E]/10`}
              >
                <LogOut
                  size={17}
                  className="text-[#B8452E]"
                />

                <span className="flex-1">
                  Logout
                </span>
              </button>

            </aside>

            {/* ================= CONTENT ================= */}
            <section className="lg:col-span-3">

              {/* Profile */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="border border-[#14213D]/20 bg-[#FFFDF9] p-8 shadow-none">
                    <h2 className={`${serif} text-2xl font-bold tracking-tight text-[#14213D]`}>
                      My Profile
                    </h2>
                    <p className={`${mono} mt-1 text-xs uppercase tracking-wider text-[#4A5568]`}>
                      View and manage your personal information.
                    </p>

                    {isLoading ? (
                      <div className={`${mono} mt-8 py-12 text-center text-xs uppercase tracking-wider text-[#4A5568]`}>
                        Loading profile details...
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}>
                            Full Name
                          </label>
                          <div className={`${mono} mt-2 border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-sm font-medium text-[#14213D]`}>
                            {user?.name || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}>
                            Email
                          </label>
                          <div className={`${mono} mt-2 border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-sm font-medium text-[#14213D]`}>
                            {user?.email || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}>
                            Account Role
                          </label>
                          <div className={`${mono} mt-2 uppercase border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-sm font-medium text-[#14213D]`}>
                            {user?.role || "USER"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Request History */}
              {activeTab === "requests" && (
                <div className="border border-[#14213D]/20 bg-[#FFFDF9] p-8">
                  <UserRequestHistory />
                </div>
              )}

              {/* Favorites */}
              {activeTab === "favorites" && (
                <div className="border border-[#14213D]/20 bg-[#FFFDF9] p-8 shadow-none">
                  <div className="flex items-center gap-3">
                    <Heart className="text-[#B8863B]" />
                    <div>
                      <h2 className={`${serif} text-2xl font-bold tracking-tight text-[#14213D]`}>
                        My Favorites
                      </h2>
                      <p className={`${mono} mt-1 text-xs uppercase tracking-wider text-[#4A5568]`}>
                        Properties you saved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* My Chats */}
              {activeTab === "chats" && (
                <div className="border border-[#14213D]/20 bg-[#FFFDF9] p-8 shadow-none space-y-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-[#14213D]" />
                    <div>
                      <h2 className={`${serif} text-2xl font-bold tracking-tight text-[#14213D]`}>
                        My Chats
                      </h2>
                      <p className={`${mono} mt-1 text-xs uppercase tracking-wider text-[#4A5568]`}>
                        View your conversations with property owners and agents.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border border-dashed border-[#14213D]/30 p-8 text-center bg-[#EFEAE0]/20">
                    <p className={`${mono} text-xs text-[#4A5568] mb-4`}>
                      Access your chat dashboard to manage ongoing conversations.
                    </p>
                    <Link
                      to="/chats" // استبدل هذا المسار بمسار صفحة المحادثات الرئيسية لديك إن كان مختلفاً
                      className={`${mono} inline-block border border-[#14213D] bg-[#14213D] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
                    >
                      Open Chat Dashboard
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === "settings" && (
                <div className="border border-[#14213D]/20 bg-[#FFFDF9] p-8 shadow-none">
                  <div className="flex items-center gap-3">
                    <Settings className="text-[#14213D]" />
                    <div>
                      <h2 className={`${serif} text-2xl font-bold tracking-tight text-[#14213D]`}>
                        Account Settings
                      </h2>
                      <p className={`${mono} mt-1 text-xs uppercase tracking-wider text-[#4A5568]`}>
                        Manage your account settings.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <button className="flex w-full items-center justify-between border border-[#14213D]/20 p-5 text-left transition hover:border-[#14213D] hover:bg-[#EFEAE0]/30">
                      <div>
                        <p className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#14213D]`}>
                          Change Password
                        </p>
                        <p className="mt-1 text-xs text-[#4A5568]">
                          Update your account password
                        </p>
                      </div>
                      <ChevronRight size={17} className="text-[#4A5568]" />
                    </button>

                    <button className="flex w-full items-center justify-between border border-[#B8452E]/30 p-5 text-left transition hover:border-[#B8452E] hover:bg-[#B8452E]/5">
                      <div>
                        <p className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#B8452E]`}>
                          Delete Account
                        </p>
                        <p className="mt-1 text-xs text-[#4A5568]">
                          Permanently delete your account
                        </p>
                      </div>
                      <ChevronRight size={17} className="text-[#B8452E]" />
                    </button>
                  </div>
                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </>
  );
};

export default User;
