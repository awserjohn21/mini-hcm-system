import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CustomAlert } from "@/components/alert";
import api from "@/lib/axios";
export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [alertDesc, setAlertDesc] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const signin = async (e) => {
    e.preventDefault();
    setAlertDesc("");
    try {
      setIsLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      await userCredential.user.getIdToken(true);
      // fetch user profile FROM BACKEND (/me)
      const res = await api.get("/me");
      const user = res.data;

      toast.success("Logged in successfully");

      // ROLE-BASED REDIRECT
      if (user.role === "admin") {
        navigate("/attendance/admin");
      } else {
        navigate("/attendance");
      }
    } catch (err) {
      console.error(err);
      setAlertDesc("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {alertDesc && (
                  <div>
                    <CustomAlert title="Login Failed" description={alertDesc} />
                  </div>
                )}

                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
