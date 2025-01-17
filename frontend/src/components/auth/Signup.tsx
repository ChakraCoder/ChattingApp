import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupPayload } from "@/types/authTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { useErrorHandler } from "@/hooks";
import { signup } from "@/apis/authApiServices";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupPayload>();

  const onSubmit: SubmitHandler<signupPayload> = async (data) => {
    try {
      setLoading(true);
      const newUser = await signup(data);
      if (newUser?.status === STATUS_CODES.CREATED) {
        navigate(`/verify-otp?email=${newUser.data.data.email}`);
      }
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Input
          placeholder="First Name"
          type="text"
          className="rounded-xl p-6"
          {...register("firstName", {
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters long",
            },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "First name can only contain alphabetic characters",
            },
          })}
        />
        {errors.firstName?.message &&
          typeof errors.firstName.message === "string" && (
            <p className="text-sm text-red-600 mt-1">
              {errors.firstName.message}
            </p>
          )}
      </div>
      <div className="mb-4">
        <Input
          placeholder="Last Name"
          type="text"
          className="rounded-xl p-6"
          {...register("lastName", {
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters long",
            },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Last name can only contain alphabetic characters",
            },
          })}
        />
        {errors.lastName?.message &&
          typeof errors.lastName?.message === "string" && (
            <p className="text-sm text-red-600 mt-1">
              {errors.lastName.message}
            </p>
          )}
      </div>
      <div className="mb-4">
        <Input
          placeholder="Email"
          type="email"
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
      <div className="mb-4">
        <Input
          placeholder="Confirm Password"
          type="password"
          className="rounded-xl p-6"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value, { password }) =>
              value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword?.message &&
          typeof errors.confirmPassword?.message === "string" && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
      </div>
      {loading ? (
        <Button disabled className="rounded-full p-6">
          <Loader2 className="animate-spin w-12 h-12" />
          Please Wait
        </Button>
      ) : (
        <Button className="rounded-full p-6">Sign up</Button>
      )}
    </form>
  );
};

export default Signup;
