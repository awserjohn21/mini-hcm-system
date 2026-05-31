import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      toast.success("Logged out successfully");

      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full p-2 transition hover:bg-gray-100 cursor-pointer"
    >
      <LogOut className="h-5 w-5 text-gray-700" />
    </button>
  );
}
