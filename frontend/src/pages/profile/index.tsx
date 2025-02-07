import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profilePayload } from "@/types/userTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { useErrorHandler } from "@/hooks";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import equal from "fast-deep-equal/es6";
import {
  getUserDetails,
  checkUserNameAvailable,
  updateUserProfile,
} from "@/apis/userApiServices";
import { STATUS_CODES } from "@/constants/statusCodes";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { useAppDispatch } from "@/app/hooks";
import { updateUser } from "@/app/slice/userSlice";
import { Label } from "@radix-ui/react-label";
import LoadingScreen from "@/common/LoadingScreen";

const Profile = () => {
  const handleError = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [userDetails, setUserDetails] = useState<profilePayload>();
  const [userName, setUserName] = useState<string | undefined>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<profilePayload>();

  // Fetch user details when the component mounts
  useEffect(() => {
    (async () => {
      const userDetailsResponse = await getUserDetails();
      setUserDetails(userDetailsResponse.data.data);
      setUserName(userDetailsResponse.data.data.userName);
      reset(userDetailsResponse.data.data);
      if (userDetailsResponse.data.data.profileImage) {
        setPreviewImage(
          `${
            NODE_ENV === "development"
              ? BACKEND_DEVELOPMENT_URL
              : BACKEND_DEPLOYED_URL
          }/${userDetailsResponse.data.data.profileImage}`
        );
      }
      dispatch(
        updateUser({
          userName: userDetailsResponse.data.data.userName,
          profileImage: userDetailsResponse.data.data.profileImage,
        })
      );
    })();
    setIsLoading(false);
  }, [dispatch, reset]);

  // Check username availability
  const handleUserNameChange = async (userName: string) => {
    setUserName(userName);
    const usernamePattern = /^[a-zA-Z0-9_]*$/;

    if (userName.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      setUsernameAvailable(false);
      return;
    }

    if (userName.length > 20) {
      setUsernameError("Username cannot exceed 20 characters");
      setUsernameAvailable(false);
      return;
    }

    if (!usernamePattern.test(userName)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      setUsernameAvailable(false);
      return;
    }

    // Clear error if local validation passes
    setUsernameError(null);

    try {
      setLoading(true);

      if (userName != userDetails?.userName) {
        const response = await checkUserNameAvailable(userName);

        if (response.status === STATUS_CODES.OK) {
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(false);
        }
      }
      setUsernameAvailable(true);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      setUsernameAvailable(false);
      if (error.status === STATUS_CODES.CONFLICT) {
        setUsernameError(error.response?.data?.error);
        return;
      }
      setUsernameError(
        "An error occurred while checking username availability"
      );
      console.error(error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setProfileImageError("Only image files are allowed.");
          return;
        }

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
          setProfileImageError("File size must be under 2MB.");
          setValue("profileImage", "");
          return;
        }
        setProfileImageError(null);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle form submission
  const onSubmit: SubmitHandler<profilePayload> = async (data) => {
    try {
      setLoading(true);
      // Compare userDetails with form data using fast-deep-equal
      if (equal(data, userDetails)) {
        // If no changes, navigate without making an API request
        navigate("/chat");
        setLoading(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Use fast-deep-equal for comparing userName
      if (!equal(data.userName, userDetails?.userName)) {
        formData.append("userName", data.userName);
      }

      // Only append profileImage if it was changed
      if (
        !equal(data.profileImage, userDetails?.profileImage) &&
        data.profileImage &&
        data.profileImage[0]
      ) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const response = await updateUserProfile(formData);
      if (response.status === STATUS_CODES.OK) {
        dispatch(
          updateUser({
            userName: response.data.data.userName,
            profileImage: response.data.data.profileImage,
          })
        );
        navigate("/chat");
      }
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-y-auto">
        <div className="bg-white border-2 border-gray-200 shadow-xl w-full max-w-3xl rounded-3xl grid pb-5">
          <div className="flex flex-col items-center justify-center px-6 py-5">
            <h1 className="font-bold text-3xl px-5 py-5">Profile</h1>
            {/* Profile Picture */}
            <div className="mb-6">
              <label htmlFor="picture">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 hover:cursor-pointer">
                  <img
                    src={previewImage || "/no-profile.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Label className="flex items-center justify-center mt-1 font-semibold">
                  Profile Image
                </Label>
              </label>
              <Input
                id="picture"
                type="file"
                className="hidden"
                accept="image/*"
                {...register("profileImage", {
                  onChange: (e) => handleImageChange(e),
                })}
              />
              {profileImageError && (
                <p className="text-sm text-red-600 mt-1">{profileImageError}</p>
              )}
              {errors.profileImage?.message && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            {/* Username Input */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="w-full max-w-md"
            >
              <div className="mb-6">
                <Label className="font-semibold">Username</Label>
                <Input
                  placeholder="Username"
                  type="text"
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
                  {...register("userName", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 20,
                      message: "Username cannot exceed 20 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]*$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                    onChange: (e) => handleUserNameChange(e.target.value),
                  })}
                />
                {usernameError && (
                  <p className="text-sm text-red-600 mt-1">{usernameError}</p>
                )}
                {/* Display availability messages */}
                {!usernameError &&
                  usernameAvailable &&
                  userName != userDetails?.userName && (
                    <p className="text-sm text-green-600 mt-1">
                      Username is available
                    </p>
                  )}
                {!usernameError && !usernameAvailable && (
                  <p className="text-sm text-red-600 mt-1">
                    Username is not available
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  className="w-full rounded-full px-6 py-3 bg-black text-white transition"
                  disabled={loading || !usernameAvailable}
                >
                  {loading && <Loader2 className="animate-spin w-6 h-6 mr-2" />}
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
