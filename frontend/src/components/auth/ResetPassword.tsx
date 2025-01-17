import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useErrorHandler, useToast } from "@/hooks";
import { resetPasswordPayload } from "@/types/authTypes";
import { resetPassword } from "@/apis/authApiServices";
import { Loader2 } from "lucide-react";
import { isAuthenticated } from "@/utils/isAuthenticated";

const ResetPassword: React.FC = () => {
  const handleError = useErrorHandler();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<resetPasswordPayload>();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/profile");
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<resetPasswordPayload> = async (data) => {
    if (!token) {
      toast({
        description: "Invalid or missing token.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (response.status === STATUS_CODES.OK) {
        toast({
          description: "Your password has been reset successfully.",
        });
        reset();
        navigate("/login");
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password below to reset your account.
          <br />
          This link will expire within 5 minutes
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <Input
              type="password"
              placeholder="New Password"
              className="rounded-lg"
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
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <Input
              type="password"
              placeholder="Confirm Password"
              className="rounded-lg"
              {...register("newPassword", {
                required: "Please confirm your password",
                validate: (value, { password }) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin mr-2 w-12 h-12" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
