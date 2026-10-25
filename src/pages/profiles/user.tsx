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
  MessageSquare,
} from "lucide-react";
import UserRequestHistory from "../properties/UserRequestHistory";

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900";

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
    { id: "profile", label: "My Profile", icon: UserIcon },
    { id: "requests", label: "Request History", icon: ClipboardList },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "chats", label: "My Chats", icon: MessageSquare },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            My Account
          </h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-stone-500">
            Manage your personal information and activity
          </p>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* ================= SIDEBAR ================= */}
          <aside className="h-fit space-y-1.5 rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider transition ${
                    active
                      ? "bg-amber-800 text-white"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon
                    size={17}
                    className={
                      active
                        ? "text-amber-200"
                        : "text-stone-400 group-hover:text-stone-900"
                    }
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={15}
                    className={`transition ${
                      active
                        ? "translate-x-0 text-amber-200"
                        : "text-stone-400 group-hover:translate-x-1"
                    }`}
                  />
                </button>
              );
            })}

            {/* Divider */}
            <div className="my-2 border-t border-stone-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={17} className="text-rose-600" />
              <span className="flex-1">Logout</span>
            </button>
          </aside>

          {/* ================= CONTENT ================= */}
          <section className="lg:col-span-3">
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                  My Profile
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                  View and manage your personal information.
                </p>

                {isLoading ? (
                  <div className="mt-8 py-12 text-center text-xs uppercase tracking-wider text-stone-500">
                    Loading profile details...
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Full Name
                      </label>
                      <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900">
                        {user?.name || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Email
                      </label>
                      <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900">
                        {user?.email || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Account Role
                      </label>
                      <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium uppercase text-amber-800">
                        {user?.role || "USER"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Request History */}
            {activeTab === "requests" && (
              <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
                <UserRequestHistory />
              </div>
            )}

            {/* Favorites */}
            {activeTab === "favorites" && (
              <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Heart className="text-amber-800" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                      My Favorites
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                      Properties you saved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* My Chats */}
            {activeTab === "chats" && (
              <div className="space-y-6 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-stone-900" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                      My Chats
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                      View your conversations with property owners and agents.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center">
                  <p className="mb-4 text-xs text-stone-500">
                    Access your chat dashboard to manage ongoing conversations.
                  </p>
                  <Link to="/chats" className={btnPrimary}>
                    Open Chat Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Settings className="text-stone-900" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                      Account Settings
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                      Manage your account settings.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-5 text-left transition hover:border-amber-800 hover:bg-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                        Change Password
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        Update your account password
                      </p>
                    </div>
                    <ChevronRight size={17} className="text-stone-400" />
                  </button>

                  <button className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-rose-200 bg-stone-50 p-5 text-left transition hover:border-rose-600 hover:bg-rose-50/50">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                        Delete Account
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        Permanently delete your account
                      </p>
                    </div>
                    <ChevronRight size={17} className="text-rose-600" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default User;
