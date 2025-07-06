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
import Error from "./Error";
import { useEffect, useState } from "react";
import z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useFetch from "@/Hooks/useFetch";
import { login, gLogin } from "@/db/apiAuth";
import toast from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";

import { useNavigate, useSearchParams } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const { isAuthenticated, loading: authLoading } = useAuth();

  const formSchema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one uppercase letter,one lowercase letter, one number, and one special character"
      ),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: trimmedValue }));
  };

  //* Regular email/password login
  const {
    data,
    error,
    loading,
    fetchData: fnLogin,
  } = useFetch(login, formData);

  //* Google Oauth login
  const {
    error: gError,
    loading: gLoading,
    fetchData: fnGoogleLogin,
  } = useFetch(gLogin, { provider: "google", source: "login" });

  const handleLogin = async (e) => {
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
    // Proceed with login logic
    setErrors({}); // Clear previous errors

    await fnLogin();
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    // Call the fetchData function to initiate Google login
    try {
      await fnGoogleLogin();
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (error == null && data) {
      // Handle successful login, e.g., redirect or show success message
      toast.success("Login successful,Welcome back!🙏");
      navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
      return;
    }
    if (error) {
      // Handle error, e.g., show error message
      toast.error(error.message);
      return;
    }

    if (gError) {
      // Handle Google OAuth error
      toast.error(gError.message);
      return;
    }
  }, [data, error, gError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
    }
  }, [isAuthenticated, navigate, longUrl]);

  if (authLoading || loading || gLoading) {
    return <LoadingSpinner message="Logging you in.." />;
  }
  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <Card className={"w-full max-w-md border-gray-600"}>
      <CardHeader>
        <CardTitle>Welcome Again 🙏 !</CardTitle>
        <CardDescription>
          Enter your Email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} noValidate>
          <div className="flex flex-col gap-6">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-primary-orange"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative r">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="mt-3 w-full"
          disabled={gLoading}
        >
          {gLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in with Google...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path
                  fill="#ff7a00"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg>{" "}
              Login with Google
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p>Don't Have an account? Go to Sign Up tab.</p>
      </CardFooter>
    </Card>
  );
};

export default Login;
