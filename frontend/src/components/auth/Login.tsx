import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginPayload } from "@/types/authTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import ForgotPassword from "./ForgotPassword";
import { useErrorHandler } from "@/hooks";
import { login, resendOtp } from "@/apis/authApiServices";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/slice/userSlice";
import setAuthToken from "@/utils/setAuthToken";

const Login = () => {
  const handleError = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginPayload>();

  const onSubmit: SubmitHandler<loginPayload> = async (data) => {
    try {
      setLoading(true);
      const userLogin = await login(data);
      if (userLogin.status === STATUS_CODES.OK) {
        setAuthToken(userLogin.data.data.token);
        dispatch(setUser(userLogin.data.data));
        navigate("/chat");
      }
      setLoading(false);
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error === "User is not Verified.") {
        await resendOtp({ email: data.email });
        navigate(`/verify-otp?email=${data.email}`);
      }
      setLoading(false);
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Input
          placeholder="Email"
          type="email"
          autoComplete="off"
          className="rounded-xl p-6"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email?.message && typeof errors.email?.message === "string" && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          placeholder="Password"
          type="password"
          autoComplete="off"
          className="rounded-xl p-6"
          {...register("password", {
            required: "Password is required",
            validate: (value) => {
              const regex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
              return (
                regex.test(value) ||
                "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 6 characters long."
              );
            },
          })}
        />
        {errors.password?.message &&
          typeof errors.password?.message === "string" && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
      </div>
      <div className="flex flex-row justify-between w-full">
        {loading ? (
          <Button disabled className="rounded-full p-6">
            <Loader2 className="animate-spin w-12 h-12" />
            Please Wait
          </Button>
        ) : (
          <Button className="rounded-full p-6">Login</Button>
        )}
        <ForgotPassword />
      </div>
    </form>
  );
};

export default Login;
