import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { usegetme } from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type LoginData = {
  email: string;
  password: string;
};

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
    <>
      <FontImports />
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-4 py-12 text-[#14213D]">

        <div className="grid w-full max-w-5xl overflow-hidden border border-[#14213D]/20 bg-[#FFFDF9] shadow-2xl md:grid-cols-2">

          {/* Image Section */}
          <div className="relative hidden min-h-[600px] md:block">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Modern house"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#14213D]/50" />

            <div className="absolute bottom-12 left-12 right-12 text-[#FFFDF9]">
              <h2 className={`${serif} text-4xl font-bold tracking-tight`}>
                Find your dream home.
              </h2>
              <p className={`${mono} mt-3 text-xs uppercase tracking-wider text-[#FFFDF9]/80`}>
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
                <h1 className={`${serif} text-3xl font-bold tracking-tight text-[#14213D]`}>
                  Welcome Back
                </h1>
                <p className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}>
                  Login to your account to continue
                </p>
              </div>

              <div className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}
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
                    className={`${mono} w-full border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-xs uppercase text-[#14213D] outline-none transition focus:border-[#14213D] focus:bg-[#FFFDF9]`}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex justify-between">
                    <label
                      htmlFor="password"
                      className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}
                    >
                      Password
                    </label>

                    <a
                      href="#"
                      className={`${mono} text-xs uppercase tracking-wider text-[#B8863B] transition hover:text-[#14213D]`}
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
                    className={`${mono} w-full border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-xs uppercase text-[#14213D] outline-none transition focus:border-[#14213D] focus:bg-[#FFFDF9]`}
                  />
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#14213D]/20 accent-[#14213D]"
                  />
                  <label
                    htmlFor="remember"
                    className={`${mono} text-xs uppercase tracking-wider text-[#4A5568]`}
                  >
                    Remember me
                  </label>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className={`${mono} mt-2 w-full border border-[#14213D] bg-[#14213D] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-[#B8863B] hover:border-[#B8863B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isPending ? "Logging in..." : "Login"}
                </button>

              </div>

              <p className={`${mono} mt-8 text-center text-xs uppercase tracking-wider text-[#4A5568]`}>
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-[#B8863B] transition hover:text-[#14213D]"
                >
                  Create account
                </a>
              </p>

            </div>
          </form>

        </div>

      </div>
    </>
  );
};

export default Login;
