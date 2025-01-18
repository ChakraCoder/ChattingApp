import { forgetPassword } from "@/apis/authApiServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useErrorHandler, useToast } from "@/hooks";
import { forgotPasswordPayload } from "@/types/authTypes";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleError = useErrorHandler();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<forgotPasswordPayload>();

  const onSubmit: SubmitHandler<forgotPasswordPayload> = async (data) => {
    try {
      setLoading(true);
      const passwordForgot = await forgetPassword(data);
      if (passwordForgot.status === STATUS_CODES.OK) {
        toast({
          description:
            "Reset Password Link has been Successfully sent to your email.",
        });
        setIsOpen(false); // Close the modal
        reset(); // Reset the form fields
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          type="button"
          className="p-6 flex text-blue-700 text-base"
          onClick={() => setIsOpen(true)} // Open the modal on click
        >
          Forgot Password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Forgot Password</DialogTitle>
          <DialogDescription>
            Enter email and click the send button to receive the Reset Password
            Link on your email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col mb-5">
          <Input
            placeholder="Email"
            type="email"
            autoComplete="off"
            className="rounded-xl p-6 col-span-3"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email?.message &&
            typeof errors.email?.message === "string" && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
        </div>
        <DialogFooter>
          {loading ? (
            <Button disabled className="rounded-full p-6">
              <Loader2 className="animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)}>Send</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
