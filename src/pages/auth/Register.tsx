import { useForm } from "react-hook-form";
import { useregister } from "../../hooks/useRegister";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "AGENT";
};

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900";

const Register = () => {
  const { mutate, isPending } = useregister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    defaultValues: {
      role: "USER",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = (data: RegisterData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Account created successfully");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      },

      onError: (error) => {
        console.log(error);
        toast.error("Registration failed");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12 text-stone-900 antialiased">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-xl md:grid-cols-2">

        {/* Image */}
        <div className="relative hidden min-h-[700px] md:block">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="Modern house"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/50" />

          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-bold tracking-tight">
              Find your dream home.
            </h2>
            <p className="mt-3 text-xs uppercase tracking-wider text-stone-200">
              Create your account and start discovering amazing properties.
            </p>
          </div>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center p-8 sm:p-12"
        >
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                Create Account
              </h1>
              <p className="mt-2 text-xs uppercase tracking-wider text-stone-500">
                Create your account to get started
              </p>
            </div>

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Name
                </label>

                <input
                  {...register("name", {
                    required: "Name is required",
                  })}
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-900 outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                />

                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Email
                </label>

                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-900 outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* User */}
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="USER"
                      {...register("role")}
                      className="peer sr-only"
                    />
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 transition peer-checked:border-amber-800 peer-checked:bg-amber-50/50 hover:border-stone-300">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-sm">
                          👤
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-stone-900">
                            User
                          </p>
                          <p className="text-[10px] uppercase text-stone-500">
                            Find properties
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Agent */}
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="AGENT"
                      {...register("role")}
                      className="peer sr-only"
                    />
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 transition peer-checked:border-amber-800 peer-checked:bg-amber-50/50 hover:border-stone-300">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-sm">
                          🏢
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-stone-900">
                            Agent
                          </p>
                          <p className="text-[10px] uppercase text-stone-500">
                            List properties
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {errors.role && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Password
                </label>

                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-900 outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                />

                {errors.password && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Confirm Password
                </label>

                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-900 outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isPending}
                className={`mt-2 w-full cursor-pointer ${btnPrimary} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isPending ? "Creating account..." : "Create Account"}
              </button>

            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-xs uppercase tracking-wider text-stone-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-amber-800 no-underline transition hover:text-stone-900"
              >
                Login
              </Link>
            </p>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;
