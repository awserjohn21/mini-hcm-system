import { SignupForm } from "@/pages/auth/components/signup-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignupForm className="w-full max-w-4xl" />
    </div>
  );
}
