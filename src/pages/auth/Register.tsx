import { useForm } from "react-hook-form";
import { useregister } from "../../hooks/useRegister";
import toast from "react-hot-toast";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "AGENT";
};

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
    <>
      <FontImports />
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-4 py-12 text-[#14213D]">

        <div className="grid w-full max-w-5xl overflow-hidden border border-[#14213D]/20 bg-[#FFFDF9] shadow-2xl md:grid-cols-2">

          {/* Image */}
          <div className="relative hidden min-h-[700px] md:block">
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
                <h1 className={`${serif} text-3xl font-bold tracking-tight text-[#14213D]`}>
                  Create Account
                </h1>
                <p className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}>
                  Create your account to get started
                </p>
              </div>

              <div className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}
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
                    className={`${mono} w-full border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-xs uppercase text-[#14213D] outline-none transition focus:border-[#14213D] focus:bg-[#FFFDF9]`}
                  />

                  {errors.name && (
                    <p className={`${mono} mt-1 text-xs text-[#B8452E]`}>
                      {errors.name.message}
                    </p>
                  )}
                </div>

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

                  {errors.email && (
                    <p className={`${mono} mt-1 text-xs text-[#B8452E]`}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className={`${mono} mb-3 block text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}>
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
                      <div className="border border-[#14213D]/20 bg-[#EFEAE0]/30 p-4 transition peer-checked:border-[#14213D] peer-checked:bg-[#EFEAE0] hover:border-[#14213D]/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center border border-[#14213D]/20 bg-[#FFFDF9] text-sm">
                            👤
                          </div>
                          <div>
                            <p className={`${mono} text-xs font-bold uppercase text-[#14213D]`}>
                              User
                            </p>
                            <p className={`${mono} text-[10px] uppercase text-[#4A5568]`}>
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
                      <div className="border border-[#14213D]/20 bg-[#EFEAE0]/30 p-4 transition peer-checked:border-[#14213D] peer-checked:bg-[#EFEAE0] hover:border-[#14213D]/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center border border-[#14213D]/20 bg-[#FFFDF9] text-sm">
                            🏢
                          </div>
                          <div>
                            <p className={`${mono} text-xs font-bold uppercase text-[#14213D]`}>
                              Agent
                            </p>
                            <p className={`${mono} text-[10px] uppercase text-[#4A5568]`}>
                              List properties
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {errors.role && (
                    <p className={`${mono} mt-1 text-xs text-[#B8452E]`}>
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}
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
                    className={`${mono} w-full border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-xs uppercase text-[#14213D] outline-none transition focus:border-[#14213D] focus:bg-[#FFFDF9]`}
                  />

                  {errors.password && (
                    <p className={`${mono} mt-1 text-xs text-[#B8452E]`}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4A5568]`}
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
                    className={`${mono} w-full border border-[#14213D]/20 bg-[#EFEAE0]/50 px-4 py-3 text-xs uppercase text-[#14213D] outline-none transition focus:border-[#14213D] focus:bg-[#FFFDF9]`}
                  />

                  {errors.confirmPassword && (
                    <p className={`${mono} mt-1 text-xs text-[#B8452E]`}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className={`${mono} mt-2 w-full border border-[#14213D] bg-[#14213D] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-[#B8863B] hover:border-[#B8863B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isPending ? "Creating account..." : "Create Account"}
                </button>

              </div>

              {/* Login Link */}
              <p className={`${mono} mt-8 text-center text-xs uppercase tracking-wider text-[#4A5568]`}>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-[#B8863B] transition hover:text-[#14213D]"
                >
                  Login
                </a>
              </p>

            </div>
          </form>

        </div>

      </div>
    </>
  );
};

export default Register;
