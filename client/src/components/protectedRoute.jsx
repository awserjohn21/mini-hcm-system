import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute() {
  const [user, setUser] = useState(undefined);
  // listens to login/logout changes from Firebase and updates the app
  // with the current user automatically.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Loading state while checking auth status
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // redirect if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Allow access if user is logged in
  return <Outlet />;
}
