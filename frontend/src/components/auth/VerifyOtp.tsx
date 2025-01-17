import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useErrorHandler } from "@/hooks";
import { useLocation } from "react-router-dom";
import { resendOtp, verifyOtp } from "@/apis/authApiServices";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/slice/userSlice";
import setAuthToken from "@/utils/setAuthToken";
import { isAuthenticated } from "@/utils/isAuthenticated";

const OtpPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch();

  // Extract email from query parameters
  const queryParams = new URLSearchParams(location.search);
  const userEmail = queryParams.get("email");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      if (value.length < 4 || value.includes(" ")) {
        toast({
          title: "Please fill all OTP fields",
          variant: "destructive",
        });
        return;
      }

      // Check if email is present
      if (!userEmail) {
        navigate("/auth");
        throw new Error("Email is missing in query parameters");
      }

      setLoading(true);
      const otp = Number(value);
      const otpVerify = await verifyOtp({ email: userEmail, otp });

      if (otpVerify.status === STATUS_CODES.OK) {
        setAuthToken(otpVerify.data.data.token);
        dispatch(setUser(otpVerify.data.data));
        navigate("/profile");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!userEmail) {
        navigate("/auth");
        throw new Error("Email is missing in query parameters");
      }
      setLoading(true);
      const otpResend = await resendOtp({ email: userEmail });

      if (otpResend.status === STATUS_CODES.OK) {
        toast({ description: "OTP Resend to Email" });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          We have sent you a OTP to your email. Please enter it below. It will
          expire after 5 minutes.
        </p>

        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={4}
            minLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup className="flex gap-4">
              <InputOTPSlot
                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg"
                index={0}
              />
              <InputOTPSlot
                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg"
                index={1}
              />
              <InputOTPSlot
                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg"
                index={2}
              />
              <InputOTPSlot
                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg"
                index={3}
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleSubmit}
            className="bg-black text-white py-3 px-6 rounded-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12" />
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          <p>
            Didn't receive the OTP?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
