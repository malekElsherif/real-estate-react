import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { usegetme } from "../../hooks/useUsers";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

type LoginData = {
  email: string;
  password: string;
};

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900";

const Login = () => {
  const { mutate, isPending } = useLogin();
  const { refetch } = usegetme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm<LoginData>();

  const onSubmit = (input: LoginData) => {
    mutate(input, {
      onSuccess: async (data) => {
        // Save token
        localStorage.setItem("token", data.accessToken);

        // Get logged-in user
        const result = await refetch();
        const user = result.data?.data;

        toast.success("Login success");

        setTimeout(() => {
          if (user?.role === "ADMIN") {
            navigate("/admin/dashboard");
          } else if (user?.role === "AGENT") {
            navigate("/agent/dashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      },

      onError: (error) => {
        console.log(error);
        toast.error("Login failed");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12 text-stone-900 antialiased">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-xl md:grid-cols-2">

        {/* Image Section */}
        <div className="relative hidden min-h-[600px] md:block">
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
              Discover beautiful properties and find the perfect place for you and your family.
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center p-8 sm:p-12"
        >
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                Welcome Back
              </h1>
              <p className="mt-2 text-xs uppercase tracking-wider text-stone-500">
                Login to your account to continue
              </p>
            </div>

            <div className="space-y-5">

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
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-stone-700"
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-xs uppercase tracking-wider text-amber-800 transition hover:text-stone-900"
                  >
                    Forgot password?
                  </a>
                </div>

                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-900 outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                />
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 accent-amber-800 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs uppercase tracking-wider text-stone-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isPending}
                className={`mt-2 w-full cursor-pointer ${btnPrimary} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isPending ? "Logging in..." : "Login"}
              </button>

            </div>

            <p className="mt-8 text-center text-xs uppercase tracking-wider text-stone-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-amber-800 no-underline transition hover:text-stone-900"
              >
                Create account
              </Link>
            </p>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
