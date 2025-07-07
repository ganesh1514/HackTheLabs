import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import z from "zod";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useFetch from "@/Hooks/useFetch";
import { signUp, gLogin } from "@/db/apiAuth";
import Error from "./Error";

import { useNavigate, useSearchParams } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [googleLoading, setGoogleLoading] = useState(false);
  const longUrl = searchParams.get("createNew");
  const redirectUrl = searchParams.get("redirect");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const formSchema = z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })

      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    profilePicture: z
      .instanceof(File)
      .refine((file) => file.size < 2 * 1024 * 1024, {
        message: "File size must be less than 2MB",
      })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        {
          message: "Only JPEG, PNG, and WEBP files are allowed",
        }
      )
      .nullable()
      .optional(),
  });

  //* Regular email/password sign-up

  const { loading, fetchData: fnSignUp } = useFetch(signUp, formData);

  //* Google Oauth sign-up
  // const {
  //   error: gError,
  //   loading: gLoading,
  //   fetchData: fnGoogleSignUp,
  // } = useFetch(gLogin, { provider: "google", source: "signup" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      const trimmedValue = typeof value === "string" ? value.trim() : value;
      setFormData((prev) => ({ ...prev, [name]: trimmedValue }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      // Handle validation errors
      const fieldErrors = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // Proceed with sign-up logic
    setErrors({}); // Clear previous errors
    await fnSignUp();
  };

  const handleGoogleSignUp = async () => {
    // Call the fetchData function to initiate Google sign-up
    setGoogleLoading(true);
    try {
      await gLogin({ provider: "google", source: "signup" });
    } catch (err) {
      toast.error(err.message);
      setGoogleLoading(false);
    }
  };

  // the block below is to handle the redirection after successful sign-up
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else if (longUrl) {
        navigate(`/dashboard?createNew=${longUrl}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, longUrl, redirectUrl]);

  return (
    <Card className={"w-full max-w-md  border-gray-600"}>
      <CardHeader>
        <CardTitle>Namaste 🙏!</CardTitle>
        <CardDescription>
          Enter your Email below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} noValidate>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              {errors.username && <Error message={errors.username} />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
              />
              {errors.email && <Error message={errors.email} />}
            </div>
            <div className="grid gap-2">
              <div className="flex">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && <Error message={errors.password} />}
              <div className="grid gap-2">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  onChange={handleChange}
                  placeholder="Upload your profile picture"
                  className={
                    "cursor-pointer file:bg-gray-500 file:rounded-sm file:px-1.5 file:py-0.5 file:border-0 file:text-sm  file:text-white h-10 file:-ml-1.5 flex items-center justify-start"
                  }
                />
                {errors.profilePicture && (
                  <Error message={errors.profilePicture} />
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
        <Button
          onClick={handleGoogleSignUp}
          variant="outline"
          className="mt-2 w-full"
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up with Google...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path
                  fill="#ff7a00"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg>{" "}
              Sign Up with Google
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter>
        <p>Already Have an account? Go to Login tab.</p>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
