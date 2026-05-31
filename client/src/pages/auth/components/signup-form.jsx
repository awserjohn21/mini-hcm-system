import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/lib/axios";
import { CustomAlert } from "@/components/alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alertDesc, setAlertDesc] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Registration Logic
  const register = async (e) => {
    e.preventDefault();

    setAlertDesc("");
    // Return early if passwords do not match
    if (form.password !== form.confirmPassword) {
      setAlertDesc("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      // Determine user timezone based on the browser's settings
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await api.post("/auth/register", {
        email: form.email,
        name: form.name,
        password: form.password,
        timezone: userTimezone,
      });
      console.log("User created:", res.data);
      // Reset the form after
      setForm({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Account Created Successfully.");
      navigate("/");
    } catch (err) {
      setAlertDesc(
        err?.response?.data?.error || "An error occurred during registration",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={register}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      disabled={isLoading}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      disabled={isLoading}
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                {alertDesc && (
                  <div>
                    <CustomAlert
                      title="Registration Failed"
                      description={alertDesc}
                    />
                  </div>
                )}
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                <FieldDescription className="text-center">
                  Already have an account? <a href="/">Sign in</a>
                </FieldDescription>
              </FieldSeparator>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block">
            <img
              src="/signup.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
