import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function PublicRoute() {
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

  // redirect if to dashboard if logged in
  if (user) {
    return <Navigate to="/attendance" replace />;
  }

  return <Outlet />;
}
