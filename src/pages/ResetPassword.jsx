import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import z from "zod";
import Error from "@/components/ui/Error";
import useFetch from "@/Hooks/useFetch";
import { updatePassword } from "@/db/apiAuth";
import supabase from "@/db/supabase";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();

  const formSchema = z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: z.string({
        required_error: "Please confirm your password",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const {
    data,

    loading,
    fetchData: fnUpdatePassword,
  } = useFetch(updatePassword, { password: formData.password });

  // Check if user has valid session from password reset
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        setIsValidSession(true);
      } else {
        toast.error("Invalid or expired reset link");
        navigate("/auth");
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await fnUpdatePassword();
  };

  // Redirect on successful password update
  useEffect(() => {
    if (data) {
      toast.success("Password updated successfully!");
      navigate("/dashboard");
    }
  }, [data, navigate]);

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange mx-auto"></div>
          <p className="mt-2 text-white">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Will redirect to auth
  }

  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Reset Password</h1>

      <Card className="w-full max-w-md border-gray-600">
        <CardHeader>
          <CardTitle>Set New Password 🔒</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
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

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Error message={errors.confirmPassword} />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
