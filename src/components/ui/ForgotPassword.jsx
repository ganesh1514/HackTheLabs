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
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import z from "zod";
import Error from "./Error";
import useFetch from "@/Hooks/useFetch";
import { resetPassword } from "@/db/apiAuth";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const emailSchema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
  });

  const {
    data,
    loading,
    fetchData: fnResetPassword,
  } = useFetch(resetPassword, { email });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await fnResetPassword();
  };

  // If email sent successfully, show confirmation
  if (data) {
    return (
      <Card className="w-full max-w-md border-gray-600">
        <CardHeader>
          <CardTitle className="text-center">Check Your Email 📧</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </p>
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-gray-600">
      <CardHeader>
        <CardTitle>Reset Password 🔑</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="m@example.com"
              />
              {errors.email && <Error message={errors.email} />}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
